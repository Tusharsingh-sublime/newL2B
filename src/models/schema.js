const mongoose = require('mongoose');

// Utility function to get today's date as a string (e.g., 'YYYY-MM-DD')
const defaultTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

// Define all schemas inside `let schema`
let schema = {
  NewAdminSchema: new mongoose.Schema({
    id: {
      type: Number,
      required: true,
      unique: true,
      default: null,
    },
    firstName: {
      type: String,
      required: false,
      default: null,
    },
    userName: {
      type: String,
      required: true,
      default: null,
    },
    roleId: {
      type: Number,
      required: false,
      default: null,
    },
    userRoleId: {
      type: String,
      required: false,
      default: null,
    },
    phoneNo: {
      type: String,
      required: true,
      default: null,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    panNo: {
      type: String,
      required: false,
      default: null,
    },
    gstNo: {
      type: String,
      required: false,
      default: null,
    },
    bankName: {
      type: String,
      required: false,
      default: null,
    },
    branch: {
      type: String,
      required: false,
      default: null,
    },
    accountNo: {
      type: String,
      required: false,
      default: null,
    },
    accountType: {
      type: String,
      required: false,
      default: null,
    },
    ifscCode: {
      type: String,
      required: false,
      default: null,
    },
    swiftCode: {
      type: String,
      required: false,
      default: null,
    },
    contactPersonName: {
      type: String,
      required: false,
      default: null,
    },
    contactPersonEmailId: {
      type: String,
      required: false,
      default: null,
    },
    contactPersonPhoneNo: {
      type: String,
      required: false,
      default: null,
    },
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
    added_by: {
      type: Number,
      required: true,
      default: null,
    },
    assingedSubscription: {
      type: String,
      required: false,
      default: null,
    },
    planType: {
      type: String,
      required: false,
      default: null,
    },
    remainingSubscription: {
      type: Number,
      required: false,
      default: null,
    },
    created_at: {
      type: String,
      required: false,
      default: defaultTodayDate,
    },
    updated_at: {
      type: String,
      required: false,
      default: null,
    },
    isActive: {
      type: Number,
      required: false,
      default: null,
    },
    accestoken: {
      type: String,
      required: false,
      default: null,
    },
    firebase_token: {
      type: String,
      required: false,
      default: null,
    },
    indiamart_key: {
      type: String,
      required: false,
      default: null,
    },
    Whatsapp_Api_Authkey_rapbooster: {
      type: String,
      required: false,
      default: null,
    },
    channelId: {
      type: String,
      required: false,
      default: null,
    },
    apiSecret: {
      type: String,
      required: false,
      default: null,
    },
    apiKey: {
      type: String,
      required: false,
      default: null,
    },
    official_whatsapp: {
      type: Number,
      required: false,
      default: null,
    },
    facebooktoken: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: Number,
      required: false,
      default: null,
    },
    email_id_to_send_mail: {
      type: String,
      required: false,
      default: null,
    },
    email_id_pass: {
      type: String,
      required: false,
      default: null,
    },
    isOfficialTemplateUploaded: {
      type: Boolean,
      required: false,
      default: false,
    },
    isUnofficialTemplateUploaded: {
      type: Boolean,
      required: false,
      default: false,
    },
    isWhatsappApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isEmailApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isIRVApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isIndiamartApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isFacebookApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isEnquiryApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    isleadApproved: {
      type: Number,
      required: false,
      default: 0,
    },
    logo: {
      type: String,
      required: false,
      default: null,
    },
    ApiVersion: {
      type: String,
      required: false,
      default: 'v1',
    },
    walab_appkey: {
      type: String,
      required: false,
      default: null,
    },
    walab_authkey: {
      type: String,
      required: false,
      default: null,
    },
    pbx_number: {
      type: String,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      default: null,
    },
    department: {
      type: Number,
      required: false,
      default: null,
    },
    department_name: {
      type: String,
      required: false,
      default: null,
    },
    user_status: {
      type: String,
      required: false,
      default: null,
    },
    dtmf: {
      type: String,
      required: false,
      default: null,
    },
    isJustDialApproved: {
      type: Number,
      required: false,
      default: 0,
    },
  }),

  // Add more schemas here if needed, e.g.:
  // AnotherSchema: new mongoose.Schema({...})
};

module.exports = schema;
