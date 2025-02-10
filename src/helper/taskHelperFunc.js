const connection = require("../config/connection");
const Schema = require('../models/schema');
const mongoos = require('../config/connection');
const ACTIVE_STATUS = Number(process.env.ACTIVE_STATUS);
const IN_ACTIVE_STATUS = Number(process.env.IN_ACTIVE_STATUS);


function convertStringToNumberIfNeeded(value) {
    // Attempt to convert the value to a number
    const number = parseFloat(value);

    // Check if the conversion result is a number and the conversion has consumed the entire string
    if (!isNaN(number) && number.toString() === value.trim()) {
        return number; // Return the number if conversion is successful
    } else {
        return value; // Return the original value if conversion is not possible
    }
}

function createObjectId(id) {
    try {
        if (id !== null) {
            return new mongoos.Types.ObjectId(id);
        } else {
            return null
        }
        // Attempt to create a new ObjectId with the provided id
    } catch (error) {
        // If an error occurs (e.g., due to an invalid id format), return null
        return convertStringToNumberIfNeeded(id);
    }
}

module.exports = {

    dropDownFetchData: async (fieldData, userCollectionName, collectionSchema) => {
        for (let field of fieldData) {
            if (field.controlname === "dropdown" && field.referenceColumn) {
                console.log("field", field.referenceColumn);
                // Dynamically get the relevant collection based on referenceTable
                let referenceCollectionName = field.referenceTable === "servicemaster" ? field.referenceTable : userCollectionName + field.referenceTable;
                let referenceCollection = connection.model(referenceCollectionName, collectionSchema);
                // Fetch the relevant data from the collection
                const dropdownData = await referenceCollection.find({ status: ACTIVE_STATUS }, {
                    id: 1,
                    [field.referenceColumn]: 1, // Only fetch the referenced column
                    _id: 1
                }).lean().exec();

                // Populate the dropdown values
                // field.dropDownValues = dropdownData.map(item => item[field.referenceColumn]);
                field.dropDownValues = dropdownData;
            }
        }
        return [];
    },

    updateIfAvailableElseInsertMaster: async (collectionName, schema, data, req, menuID) => {
        // return console.log(data);


        return new Promise(async function (resolve, reject) {
            if (mongoos.models[collectionName]) {
                delete mongoos.models[collectionName];
                // delete mongoos.modelSchemas[collectionName];
            }
            let model
            if (typeof schema == "object") {
                model = mongoos.model(collectionName, mongoos.Schema(schema));
                // console.log("schema", model);
            }
            else {
                let finalschema = Schema[schema] || Schema["any"];
                model = mongoos.model(collectionName, finalschema);
            }

            let taskManagementModel
            if (mongoos.models['taskManagement']) {
                taskManagementModel = mongoos.models['taskManagement'];
            }
            else {
                taskManagementModel = mongoos.model('taskManagement', Schema.taskManagement);
            }
            let taskManagementData = await taskManagementModel.aggregate([
                { $match: { $or: [{ _id: createObjectId(menuID) }, { menuID: menuID }] } },
                // {$project: {_id: 0}}
            ]);
            taskManagementData = taskManagementData[0];
            console.log("2");


            var isUpdate = data.id != null && data.id != '';
            let originalData = null;

            if (isUpdate) {
                originalData = await model.findOne({ id: data.id }).lean();
                if (!originalData) {
                    isUpdate = false;
                }
            }
            const detectChanges = (original, updated) => {
                let changes = {};
                Object.keys(updated).forEach(key => {
                    if (!original.hasOwnProperty(key) || original[key] !== updated[key]) {
                        if (typeof updated[key] === 'object' && updated[key] !== null) {
                            const subChanges = detectChanges(original[key] || {}, updated[key]);
                            if (Object.keys(subChanges).length > 0) {
                                changes[key] = subChanges;
                            }
                        } else {
                            changes[key] = updated[key];
                        }
                    }
                });

                // Check if 'tableName' has changed
                if (original.tableName !== updated.tableName) {
                    changes.tableName = {

                        tableName: updated.tableName,
                    };
                }

                return changes;
            };

            if (isUpdate) {

                // Check if it's a delete operation
                if (data.status === 2 && data.id) {
                    const documentId = data.id;
                    model.findOneAndUpdate({ id: data.id }, data, { new: true, upsert: true }).then((result) => {
                        data = result
                        resolve(result);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });

                    // resolve({ message: 'Document deleted' });
                } else {
                    // It's an update operation
                    model.findOneAndUpdate({ id: data.id }, data, { new: true, upsert: true }).then((result) => {
                        const updatedData = result.toObject();
                        const changes = detectChanges(originalData, updatedData);

                        // Filter and keep only the updated fields in previousChanges
                        let previousFields = {};

                        // Iterate through updated fields and check if they were changed
                        for (let key in data) {
                            if (originalData[key] !== data[key]) {
                                previousFields[key] = originalData[key];
                            }
                        }

                        const fieldsToExclude = ['createdDate', 'updatedDate', 'createdBy', 'updatedBy', 'clientCode'];
                        fieldsToExclude.forEach(field => {
                            delete previousFields[field];
                            delete changes[field];
                        });
                        resolve(result);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }
            }
            else {
                data.id == "" ? data.id = await idCounter(model, 'id') : "";
                let newData = new model(data);

                newData.save().then(async (savedData) => {

                    // Since it's an insert, previousChanges should be an empty object
                    let previousChanges = {};
                    resolve(savedData);
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            }
        });
    },

    AggregateFetchData: async (collectionName, schema, query, res) => {

        return new Promise(function (resolve, reject) {
            let Schemavar = Schema[schema] || Schema.any
            let model
            if (mongoos.models[collectionName]) {
                delete mongoos.models[collectionName];
            }

            model = mongoos.model(collectionName, Schemavar);
            //        console.log(model);
            //        console.log('model.....................123');

            model.aggregate(query).allowDiskUse(true).then((result) => {
                resolve(result);
            })
                .catch((err) => {
                    reject(err);
                })
        });
    },

    // updateIfAvailableElseInsertMaster: async (collectionName, schema, data, req, menuID,) => {
    //     // return console.log(data);


    //     //    console.log("menuID", createObjectId(menuID));
    //     //    console.log(data);
    //     //    console.log("req", req);

    //     return new Promise(async function (resolve, reject) {
    //         if (mongoos.models[collectionName]) {
    //             delete mongoos.models[collectionName];
    //             // delete mongoos.modelSchemas[collectionName];
    //         }
    //         let model
    //         if (typeof schema == "object") {
    //             model = mongoos.model(collectionName, mongoos.Schema(schema));
    //             // console.log("schema", model);
    //         }
    //         else {

    //             let finalschema = Schema[schema] || Schema["any"];
    //             model = mongoos.model(collectionName, finalschema);
    //         }


    //         let tblFormcontrolmodel
    //         if (mongoos.models['tblFormcontrol']) {
    //             tblFormcontrolmodel = mongoos.models['tblFormcontrol'];

    //         }
    //         else {
    //             tblFormcontrolmodel = mongoos.model('tblFormcontrol', Schema.mainTableSchema);
    //         }
    //         let tblFormcontrolData = await tblFormcontrolmodel.aggregate([
    //             { $match: { $or: [{ _id: createObjectId(menuID) }, { menuID: menuID }], clientCode: data.clientCode } },
    //             // {$project: {_id: 0}}
    //         ]);
    //         tblFormcontrolData = tblFormcontrolData[0];

    //         var isUpdate = data.id != null && data.id != '';
    //         let originalData = null;

    //         if (isUpdate) {
    //             originalData = await model.findOne({ id: data.id }).lean();
    //             if (!originalData) {
    //                 isUpdate = false;
    //             }
    //         }

    //         //        // console.log("tblFormcontrolData", tblFormcontrolData);

    //         const detectChanges = (original, updated) => {
    //             let changes = {};
    //             Object.keys(updated).forEach(key => {
    //                 if (!original.hasOwnProperty(key) || original[key] !== updated[key]) {
    //                     if (typeof updated[key] === 'object' && updated[key] !== null) {
    //                         const subChanges = detectChanges(original[key] || {}, updated[key]);
    //                         if (Object.keys(subChanges).length > 0) {
    //                             changes[key] = subChanges;
    //                         }
    //                     } else {
    //                         changes[key] = updated[key];
    //                     }
    //                 }
    //             });

    //             // Check if 'tableName' has changed
    //             if (original.tableName !== updated.tableName) {
    //                 changes.tableName = {
    //                     tableName: updated.tableName,
    //                 };
    //             }

    //             return changes;
    //         };

    //         if (isUpdate) {
    //             // Check if it's a delete operation
    //             if (data.status === 2 && data.id) {
    //                 // Log the "delete" action and include the document ID
    //                 const documentId = data.id;
    //                 model.findOneAndUpdate({ id: data.id }, data, { new: true, upsert: true }).then((result) => {
    //                     data = result
    //                     resolve(result);
    //                 }).catch((err) => {
    //                     //                    console.log(err);
    //                     reject(err);
    //                 });

    //                 // resolve({ message: 'Document deleted' });
    //             } else {
    //                 // It's an update operation
    //                 model.findOneAndUpdate({ id: data.id }, data, { new: true, upsert: true }).then((result) => {
    //                     const updatedData = result.toObject();
    //                     const changes = detectChanges(originalData, updatedData);

    //                     // Filter and keep only the updated fields in previousChanges
    //                     let previousFields = {};

    //                     // Iterate through updated fields and check if they were changed
    //                     for (let key in data) {
    //                         if (originalData[key] !== data[key]) {
    //                             previousFields[key] = originalData[key];
    //                         }
    //                     }

    //                     const fieldsToExclude = ['createdDate', 'updatedDate', 'createdBy', 'updatedBy', 'clientCode'];
    //                     fieldsToExclude.forEach(field => {
    //                         delete previousFields[field];
    //                         delete changes[field];
    //                     });

    //                     resolve(result);
    //                 }).catch((err) => {
    //                     //                    console.log(err);
    //                     reject(err);
    //                 });
    //             }
    //         }
    //         else {
    //             data.id == "" ? data.id = await idCounter(model, 'id') : "";
    //             let newData = new model(data);

    //             newData.save().then(async (savedData) => {
    //                 //                console.log(savedData);
    //                 //                console.log('savedata');

    //                 // Since it's an insert, previousChanges should be an empty object
    //                 let previousChanges = {};

    //                 resolve(savedData);
    //             }).catch((err) => {
    //                 //                console.log(err);
    //                 reject(err);
    //             });
    //         }
    //     });
    // },

    validateAfterInsert: async (tableName, clientName, insertedData) => {
        try {

            return { success: true, message: "Post-insert validation passed" };
            // throw new Error("Post-insert validation failed");
        } catch (error) {
            // Handle the error thrown during post-insert validation
            console.error("Post-insert validation error:", error.message);

            // If validation fails, delete the inserted record

            let collection = mongoose.model(tableName, Schema.tableName);
            await collection.updateOne({ id: insertedData.id }, { status: 2 });

            // Return the specific validation error message in the response
            return { success: false, message: error.message, data: null };
        }
    },

    createObjectId: (id) => {
        try {
            if (id !== null) {
                return new mongoos.Types.ObjectId(id);
            } else {
                return null
            }
            // Attempt to create a new ObjectId with the provided companyId
        } catch (error) {
            // If an error occurs (e.g., due to an invalid companyId format), return null
            return convertStringToNumberIfNeeded(companyId);
        }
    }

}
