const fs = require('fs');
const xml2js = require('xml2js');

module.exports.doParsing = function(basePath, xliffPath) {

  const content = fs.readFileSync(xliffPath);

  xml2js.parseString(content, (err, result) => {
    result.xliff.file.forEach((fileTag) => {
      const meta = fileTag.$;

      const original = meta.original;

      var filename = "";
      var files = [];
      if (original.search("storyboard") != -1) {
        // Storyboard file
        const components = original.split("/");
        const tempName = components.pop().split(".")[0];
        filename = `${tempName}.strings`;
        components.pop();
        files = components;
      } else if (original.search("Info.plist") != -1) {
        filename = "InfoPlist.strings";
        const components = original.split("/");
        components.pop();
        files = components;
      } else {
        files = original.split("/");
        filename = files.pop();
      }

      if (files.length == 0) {
        return;
      }

      const target = meta["target-language"]
      var filePath = `${basePath}/${files.join("/")}/${target}.lproj/${filename}`;
      filePath = filePath.replace(/\/\//g, "/");

      var content = "";

      fileTag.body[0]["trans-unit"].filter((unit) => {
        return unit.target;
      }).forEach((unit) => {
        var comment = ""
        if (unit.note) {
          comment = `/* ${unit.note[0]} */\n`;
        } else {
          comment = "/* (No Comment) */\n";
        }

        const target = unit.target[0].replace(/"/g, "\\\"");

        if (!target) {
          return;
        }

        const def = `"${unit.$.id}" = "${target}";\n`;
        content += comment
        content += def
        content += "\n";
      })

      if (!content) {
        content = "/* No Localized Strings */\n";
      }
      fs.writeFileSync(filePath, content);
    })
  });
};