
// const NodeCache = require('node-cache')

// const cache = new NodeCache({ stdTTL: 5 * 60 })

// function getUrlFromRequest(req) {
//   const url = req.protocol + '://' + req.headers.host + req.originalUrl
//   return url
// }

// function set(req, res, next) {
//   const url = getUrlFromRequest(req)
//   cache.set(url, res.locals.data)
//   console.log(url);
//   console.log(res.locals.data);
//   return next()
// }

// function get(req, res, next) {
//   const url = getUrlFromRequest(req)
//   const content = cache.get(url)
//   if (content) {
//     console.log(url);
//   console.log(content);
//     return res.status(200).send(content)
//   }
//   return next()
// }

const lru = require('lru-cache');

module.exports = function mongooseCachePlugin(schema, options) {
  // Set up the LRU cache
  const cacheOptions = options || { max: 40000, maxAge: 1000 * 60 * 5 }; // Customize cache size and expiration time
  const cache = new lru.LRUCache(cacheOptions);

  // Create a custom function to cache query results
  schema.statics.cachedQuery = async function (key, queryFn) {
    const cachedResult = cache.get(key);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await queryFn();
    cache.set(key, result);
    return result;
  };
};
