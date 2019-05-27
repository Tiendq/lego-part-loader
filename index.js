const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const config = require('dotenv-safe').config();
const scraper = require('./scraper');
const { downloadPartImage } = require('./part-image');
const { uploadPart } = require('./part-store');

async function start() {
  let partIds = readInputPartIds();

  if (partIds)
    console.log(`Found ${partIds.length} part IDs from file parts.txt`);
  else
    return false;

  let downloadTempDir = fs.mkdtempSync(os.tmpdir() + '/');
  let validIds = partIds.filter(id => id.length > 0);
  let count = 0;

  for (let id of validIds) {
    let part = await loadPartData(id);

    if (part) {
      part.fileName = path.join(downloadTempDir, part.id + '.jpg');
      console.log(`Downloading part image ${part.id} to ${part.fileName}`);
      await downloadPartImage(part.data.sourceImageUrl, part.fileName);

      console.log('Uploading part to store');
      await uploadPart(part);
    }
  }

  console.log(`Done. Uploaded ${count} of ${partIds.length} parts.`);
}

function readInputPartIds() {
  try {
    let content = fs.readFileSync('parts.txt', 'utf8');
    return content.length > 0 ? content.split(/\r?\n/) : null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function loadPartData(id) {
  console.log(`Parsing part ${id}`);

  let data = await scraper.getPartData(id);

  if (!data)
    console.log(chalk.red('Parse error'));
  else
    console.log(chalk.green('Parse success'));

  return {
    id,
    data
  }
}

start();
