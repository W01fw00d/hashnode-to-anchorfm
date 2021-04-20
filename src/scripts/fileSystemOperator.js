const fs = require("fs");
const { UTF_8, JSON_EXTENSION } = require("./constants");

const writeFile = (path, data, callback) => {
  fs.writeFile(path, data, UTF_8, (error, text) => {
    if (error) {
      throw new Error(error);
    }

    callback(text);
  });
};

exports.readFile = (path, callback) => {
  fs.readFile(path, UTF_8, (error, text) => {
    if (error) {
      throw new Error(error);
    }

    callback(text);
  });
};

exports.readFolder = (path, callback) => {
  fs.readdir(path, (error, files) => {
    if (error) {
      throw new Error(error);
    }

    callback(files);
  });
};

exports.writeJSONFile = (path, data, callback) => {
  const whiteSpaceInsertion = 2;
  writeFile(
    `${path}.${JSON_EXTENSION}`,
    JSON.stringify(data, null, whiteSpaceInsertion),
    callback
  );
};

exports.deleteFile = (path) => {
  try {
    fs.unlinkSync(path); //TODO: Create a mock for this script, for dev use
    //console.log(`${file} deleted.`);
  } catch (error) {
    console.error(error);
  }
};
