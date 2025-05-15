const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const outputFile = path.join(__dirname, "..", "data", "assets.json");

const generateAssetsJson = () => {
  const assets = [];

  if (!fs.existsSync(assetsDir)) {
    console.error("De assets-map bestaat niet.");
    process.exit(1);
  }

  fs.readdirSync(assetsDir).forEach(folder => {
    const folderPath = path.join(assetsDir, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      fs.readdirSync(folderPath).forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileExtension = path.extname(file).toLowerCase();
        let fileType = "other";

        // Bepaal het bestandstype
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension)) {
          fileType = "image";
        } else if ([".mp3", ".wav"].includes(fileExtension)) {
          fileType = "audio";
        } else if ([".mp4", ".mov"].includes(fileExtension)) {
          fileType = "video";
        }

        // Voeg het bestand toe aan de assets-array
        assets.push({
          name: file,
          category: folder,
          type: fileType,
          thumbnail: fileType === "image" ? `/assets/${folder}/${file}` : null
        });
      });
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(assets, null, 2));
  console.log(`assets.json gegenereerd in ${outputFile}`);
};

generateAssetsJson();