const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");
const outputFile = path.join(__dirname, "..", "data", "assets.json");

const generateAssetsJson = () => {
  const buildDirectoryStructure = (dirPath, category = "root") => {
    const items = fs.readdirSync(dirPath);
    const structure = [];

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.lstatSync(itemPath);

      if (stats.isDirectory()) {
        const newCategory = path.relative(assetsDir, itemPath).split(path.sep)[0];
        structure.push({
          name: item,
          type: "directory",
          category: category,
          children: buildDirectoryStructure(itemPath, newCategory),
        });
      } else {
        const ext = path.extname(item).toLowerCase();
        let fileType = "other";

        if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
          fileType = "image";
        } else if ([".mp3", ".wav", ".ogg"].includes(ext)) {
          fileType = "audio";
        } else if ([".mp4", ".mov", ".webm", ".mpeg"].includes(ext)) {
          fileType = "video";
        } else if ([".md", ".txt", ".log"].includes(ext)) {
          fileType = "text";
        } else if ([".pdf"].includes(ext)) {
          fileType = "pdf";
        }

        const relativePath = path.relative(assetsDir, itemPath).replace(/\\/g, "/");
        const baseCategory = relativePath.split("/")[0] || "root";

        structure.push({
          name: item,
          type: fileType,
          thumbnail: fileType === "image" ? `/assets/${relativePath}` : "fa-smile",
          category: baseCategory,
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
      if (item.type === "directory" && item.children) {
        assignThumbnails(item.children, allAssets);
      } else if (!item.thumbnail || item.thumbnail === "fa-smile") {
        const baseTitle = item.name.split("-")[0];
        const matchingCover = allAssets.find(
          (asset) =>
            asset.type === "image" &&
            asset.category === "covers" &&
            asset.name.toLowerCase().startsWith(baseTitle.toLowerCase())
        );

        if (matchingCover) {
          item.thumbnail = matchingCover.thumbnail;
        }
      }
    });
  };

  if (!fs.existsSync(assetsDir)) {
    console.error("De assets-map bestaat niet.");
    process.exit(1);
  }

  const assets = buildDirectoryStructure(assetsDir);
  const allAssets = flattenAssets(assets);
  assignThumbnails(assets, allAssets);

  fs.writeFileSync(outputFile, JSON.stringify(assets, null, 2));
  console.log(`assets.json gegenereerd in ${outputFile}`);
};

generateAssetsJson();
