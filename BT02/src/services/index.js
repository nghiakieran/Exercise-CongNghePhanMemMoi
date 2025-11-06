const isMongo = (process.env.DB || '').toLowerCase() === 'mongo' || !!process.env.MONGODB_URI;

let service;
if (isMongo) {
  service = require('./CRUDService.mongo');
} else {
  service = require('./CRUDService');
}

module.exports = service;
