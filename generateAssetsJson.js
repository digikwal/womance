const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "assets");
const outputFile = path.join(__dirname, "data", "assets.json");

const generateAssetsJson = () => {
  const categories = {};

  if (!fs.existsSync(assetsDir)) {
    console.error("De assets-map bestaat niet.");
    process.exit(1);
  }

  fs.readdirSync(assetsDir).forEach(folder => {
    const folderPath = path.join(assetsDir, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      categories[folder] = fs.readdirSync(folderPath);
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
  console.log(`assets.json gegenereerd in ${outputFile}`);
};

generateAssetsJson();