import lunr from "lunr";

const search = process.argv[2];

if (!search) {
  console.error("Please provide a search term");
  process.exit(1);
}

const path = "./output/index.json";
const file = Bun.file(path);
const index = await file.json();

const idx = lunr.Index.load(index);
const results = idx.search(search);

console.log(results);
