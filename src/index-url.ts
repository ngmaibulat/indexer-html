import fs from "fs/promises";
import lunr from "lunr";
import { fetchUrl } from "./functions";

const url =
  "https://dev.to/bekahhw/the-cost-of-clinging-to-legacy-software-risks-and-realities-2l3i";

const indexFile = "./output/index.json";
const outputFile = "./output/documents.json";

const documents = await fetchUrl(url);
await fs.writeFile(outputFile, JSON.stringify(documents, null, 2), "utf-8");

const idx = lunr(function () {
  this.field("title");
  this.field("heading");
  this.field("body");
  this.ref("id");

  documents.forEach((doc) => this.add(doc));
});

const serializedIndex = JSON.stringify(idx);
await fs.writeFile(indexFile, serializedIndex);
