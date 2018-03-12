const {doParsing} = require('./parser');
const pathConfig = require('./pathConfig');

const basePath = pathConfig["basePath"];
const xliffPaths = pathConfig["xliffPaths"];

xliffPaths.forEach((xliffPath) => {
  doParsing(basePath, xliffPath);
});
