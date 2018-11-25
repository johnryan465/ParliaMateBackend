const fs = require("fs");

class DataManager {

  static getFile(newfilepath) { //basic file management. All files come through here
    return JSON.parse(fs.readFileSync(newfilepath, "utf8"));
  }

  static setFile(data, newfilepath) { //All files set through here
    fs.writeFileSync(newfilepath, JSON.stringify(data, null, 4));
  }

  static getData() { //get tally
    return DataManager.getFile("./data.json");
  }

  static setData(data) { //get tally
    return DataManager.setFile(data, "./data.json");
  }

}

module.exports = DataManager;