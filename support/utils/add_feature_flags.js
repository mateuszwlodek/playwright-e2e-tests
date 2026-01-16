import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, "../../fixtures/feature_flags.json");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

function addFeatureFlag(featureFlag) {
  return new Promise((resolve, reject) => {
    json.push(featureFlag);
      fs.writeFile(
      jsonPath,
      JSON.stringify(json, null, 2),
      (err) => {
        if (err) reject(err);
        resolve("File saved.");
      }
    );
  });
}

if (process.argv[2] !== undefined) {
  process.argv[2].split(",").map((featureFlag) =>
    addFeatureFlag(featureFlag).then((result) => {
      console.log(result);
    })
  );
} else {
  console.log("No feature flags to add!");
}
