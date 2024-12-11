import type { Document } from "./types";

import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

async function extractDataFromHtml(
  filePath: string,
  fileName: string
): Promise<Document> {
  const content = await fs.readFile(filePath, "utf-8");
  const $ = cheerio.load(content);

  return {
    id: fileName,
    title: $("title").text().trim(),
    heading: $("h1").length > 0 ? $("h1").text().trim() : "",
    body: $("body").text().trim(),
  };
}

function extractHtml(id: string, content: string): Document {
  const $ = cheerio.load(content);

  let body = "";

  const main = $("main").text().trim();

  if (main) {
    body = main;
  } else {
    body = $("body").text().trim();
  }

  return {
    id,
    title: $("title").text().trim(),
    heading: $("h1").length > 0 ? $("h1").text().trim() : "",
    body,
  };
}

export async function extractDocuments(htmlDir: string): Promise<Document[]> {
  const files = await fs.readdir(htmlDir);
  const documents: Document[] = [];

  for (const file of files) {
    if (path.extname(file) === ".html") {
      const filePath = path.join(htmlDir, file);
      const document = await extractDataFromHtml(filePath, file);
      documents.push(document);
    }
  }

  return documents;
}

export async function fetchUrl(url: string): Promise<Document[]> {
  const res = await fetch(url);
  const html = await res.text();
  const documents: Document[] = [];

  const doc = extractHtml(url, html);
  documents.push(doc);

  return documents;
}
