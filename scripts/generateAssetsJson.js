const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const outputFile = path.join(__dirname, "..", "data", "assets.json");

const generateAssetsJson = () => {
  const buildDirectoryStructure = (dirPath) => {
    const items = fs.readdirSync(dirPath);
    const structure = [];

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.lstatSync(itemPath);

      if (stats.isDirectory()) {
        // Recursief directories verwerken
        structure.push({
          name: item,
          type: "directory",
          children: buildDirectoryStructure(itemPath),
        });
      } else {
        // Bestanden verwerken
        const fileExtension = path.extname(item).toLowerCase();
        let fileType = "other";

        // Bepaal het bestandstype
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension)) {
          fileType = "image";
        } else if ([".mp3", ".wav"].includes(fileExtension)) {
          fileType = "audio";
        } else if ([".mp4", ".mov"].includes(fileExtension)) {
          fileType = "video";
        }

        structure.push({
          name: item,
          type: fileType,
          thumbnail: fileType === "image" ? `/assets/${path.relative(assetsDir, itemPath).replace(/\\/g, "/")}` : null,
        });
      }
    });

    return structure;
  };

  const flattenAssets = (directory) => {
    const flatList = [];
    const traverse = (dir) => {
      dir.forEach((item) => {
        flatList.push(item);
        if (item.type === "directory" && item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(directory);
    return flatList;
  };

  const assignThumbnails = (directory, allAssets) => {
    directory.forEach((item) => {
      if (item.type === "directory") {
        // Recursief thumbnails toewijzen aan subdirectories
        assignThumbnails(item.children, allAssets);
      } else if (!item.thumbnail) {
        // Zoek een bijpassende cover in de "covers" categorie
        const baseTitle = item.name.split("-")[0];
        const matchingCover = allAssets.find(
          (asset) =>
            asset.type === "image" &&
            asset.category === "covers" &&
            asset.name.startsWith(baseTitle)
        );

        if (matchingCover) {
          item.thumbnail = matchingCover.thumbnail; // Gebruik de gevonden cover als thumbnail
        } else {
          // Gebruik een standaard Font Awesome-smiley als fallback
          item.thumbnail = "fa-smile"; // Dit kan in de frontend worden geïnterpreteerd als een Font Awesome-icoon
        }
      }
    });
  };

  if (!fs.existsSync(assetsDir)) {
    console.error("De assets-map bestaat niet.");
    process.exit(1);
  }

  const assets = buildDirectoryStructure(assetsDir);

  // Maak een platte lijst van alle assets
  const allAssets = flattenAssets(assets);

  // Voeg de categorie toe aan elk item in de platte lijst
  allAssets.forEach((asset) => {
    const parentDir = path.dirname(asset.name);
    asset.category = parentDir === "." ? "root" : parentDir;
  });

  // Thumbnails toewijzen
  assignThumbnails(assets, allAssets);

  fs.writeFileSync(outputFile, JSON.stringify(assets, null, 2));
  console.log(`assets.json gegenereerd in ${outputFile}`);
};

generateAssetsJson();