import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import user from "../queries/user.query.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const myHeaders = new fetch.Headers();

async function getUserID(file, token) {
  const configPath = path.join(__dirname, `../../config/${file}.json`);
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const graphQLUrl = config.env.graphQLUrl;
  const businessID = config.env.businessID;
  const branchID = config.env.branchID;

  myHeaders.append("x-memento-security-context", businessID + "|" + branchID);
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const graphql = JSON.stringify({
    query: user.getUser,
    variables: {},
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
    redirect: "follow",
  };

  return await fetch(graphQLUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("2. Server response wasn't OK");
      }
    })
    .then((json) => {
      myHeaders.delete("x-memento-security-context");
      myHeaders.delete("Authorization");
      myHeaders.delete("Content-Type");

      return json.data.user.id;
    });
}

export default getUserID;
