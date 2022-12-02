const fs = require("fs");
class WebOSApp {
  constructor(name, id, desc, icon) {
    this.name = name;
    this.id = id;
    this.desc = desc;
    let icon_image = fs.readFileSync("./resource/apps/img/" + icon);
    let icon_base64 = Buffer.from(icon_image).toString("base64");
    this.icon = icon_base64;
  }
}

module.exports = WebOSApp;