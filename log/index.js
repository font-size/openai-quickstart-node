// helpers/logger.js
// const simpleLogger = require('simple-node-logger');

// const logger = simpleLogger.createRollingFileLogger({
//   logDirectory: 'logs/',
//   fileNamePattern: 'export_log_<DATE>.log',
//   dateFormat: 'YYYY.MM.DD',
// });

// module.exports = logger;


import simpleLogger from 'simple-node-logger';
const logger = simpleLogger.createRollingFileLogger({
  logDirectory: 'logs/',
  fileNamePattern: 'export_log_<DATE>.log',
  dateFormat: 'YYYY.MM.DD',
});
export default logger
