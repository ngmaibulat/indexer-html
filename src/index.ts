import fs from "fs/promises";
import lunr from "lunr";
import { extractDocuments } from "./functions";

const htmlDir = "./html";
const outputFile = "./output/documents.json";
const indexFile = "./output/index.json";

const documents = await extractDocuments(htmlDir);
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
