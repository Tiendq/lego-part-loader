let fs = require('fs');
let chalk = require('chalk');
let config = require('dotenv').config();
let scraper = require('./scraper');
let { downloadPartImage } = require('./part-image');
let { uploadParts } = require('./part-store');

let log = console.log;
let partIds = [], parsedParts = [];

async function start() {
  log('*** Read input parts for retrieving data...');

  partIds = readInputPartIds();

  log('*** Retrieving part data...');

  for (let id of partIds) {
    if (id) {
      let data = await loadPartData(id);
      parsedParts.push(data);
    }
  };

  if (0 === parsedParts.length) {
    log(chalk.yellow('*** No part found. Exit.'));
    return false;
  }

  log('*** Retrieving part image...');

  for (let part of parsedParts) {
    if (part.data) {
      log(`Download image ${part.id}`);

      part.fileName = `${part.id}.jpg`;
      await downloadPartImage(part.data.sourceImageUrl, part.fileName);
    }
  };

  log('*** Uploading parts to store...');
  let count = await uploadParts(parsedParts);

  log(`*** Done. Uploaded ${count} of ${parsedParts.length} parts.`);
}

async function loadPartData(id) {
  log(`Parsing part ${id}`);

  let data = await scraper.getPartData(id);

  if (!data)
    log(chalk.red('Parse error'));
  else {
    log(chalk.green('Parse success'));
 // console.log(data);
}

  return {
    id,
    data
  };
}

function readInputPartIds() {
  let content = fs.readFileSync('parts.txt', { encoding: 'utf8' });
  let partIds = content.split(/\r?\n/);
  return partIds;
}

start();
