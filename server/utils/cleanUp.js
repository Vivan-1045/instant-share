const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const tempDir = path.join(__dirname, "../temp");
const TTL = 2 * 60 * 1000;

cron.schedule("* * * * *", () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error("Failed to read temp directory");

    files.forEach((file) => {
      const filePath = path.join(tempDir, file);

      try {
        fs.stat(filePath, (err, stats) => {
          if (err)
            return console.error("Failed to get file stats for", filePath);
          if (Date.now() - stats.mtimeMs > TTL) {
            fs.unlink(filePath, (err) => {
              if (err) console.error("Failed to delete", filePath);
              else console.log(`Deleted ${filePath} due to TTL expiration`);
            });
          }
        });
      } catch (e) {
        console.error("Unexpected error while cleaning up", filePath, e);
      }
    });
  });
});
