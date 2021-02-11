const fs = require('fs');
const path = require('path');
const { jsonParser } = require('../../lib/helpers');

const baseDir = path.join(__dirname, '../.data');

module.exports = {
  /** crates a doc in a collection (folder)
   * @param {String} collection name of the collection/dir
   * @param {String} doc name of the doc/file , will be saved as json file
   * @param {object} data Object to be saved
   * @param {SaveCallback} callback
   */
  create(collection, doc, data, callback) {
    const filePath = path.resolve(baseDir, collection, doc + '.json');
    // open for writing in file , `Note:` open doesn't do recursive writing with the `'w'` switch
    fs.open(filePath, 'wx', function (err, fileDescriptor) {
      if (err) return callback('File might already exist');
      // write into file the strigified Data
      data = JSON.stringify(data);
      fs.writeFile(fileDescriptor, data, function (err) {
        if (err) return callback('Error Writing to the file');
        // close after writing completed
        fs.close(fileDescriptor, (err) => {
          if (err) return callback('Error closing the file');
          callback(null);
        });
      });
    });
  },

  /** Reads file contents
   * @param {string} collection name of the collection/dir
   * @param {string} doc name of the doc/file , will be saved as json file
   * @param {ReadCallback} callback
   */
  read(collection, doc, callback) {
    const filePath = path.resolve(baseDir, collection, doc + '.json');
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (!err && data) callback(null, jsonParser(data));
      else callback(err);
    });
  },

  /** Update file
   * @param {string} collection name of the collection/dir
   * @param {string} doc name of the doc/file , will be saved as json file
   * @param {object} data Object to be saved/updated
   * @param {SaveCallback} callback
   */
  update(collection, doc, data, callback) {
    const filePath = path.resolve(baseDir, collection, doc + '.json');
    // open file for updating
    fs.open(filePath, 'r+', function (err, file) {
      if (err) callback('Could Not open file for updating, may not exist yet');
      // truncate first (because `r+` flag alters writeFile behavior to writing from start in place of old text)
      fs.truncate(filePath, function (err) {
        if (err) return callback('Error truncating file');
        //write to file
        fs.writeFile(file, JSON.stringify(data), function (err) {
          if (err) return callback('Error writing to existing file');
          //close file as opened file descriptors in writeFile and such mehtods are not closed automatically
          fs.close(file, function (err) {
            callback(err ? 'Error closing existing file' : null);
          });
        });
      });
    });
  },

  /** Delete doc from collection
   * @param {String} collection name of collection/dir
   * @param {String} doc name of doc/file
   * @param {DeleteCallback} callback
   *
   */
  delete(collection, doc, callback) {
    const filePath = path.resolve(baseDir, collection, doc + '.json');
    fs.unlink(filePath, function (err) {
      callback(err ? 'Error deleting file' : null);
    });
  },
};

// ============ Types from jsDoc ================
/** @callback SaveCallback
 * @param {String} err error encountered when handling file operation
 */

/** @callback DeleteCallback
 * @param {String} err  error encountered when handling file operation
 */

/**@callback ReadCallback
 * @param {String} err error encountered when handling file operation
 * @param {object} data
 */
