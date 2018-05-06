let fs = require('fs');
let chalk = require('chalk');
let scraper = require('./scraper');
let { downloadPartImage } = require('./part-image');
let { uploadParts } = require('./part-store');

let partIds = [], parsedParts = [];

async function start() {
  console.log('*** Read input parts for retrieving data...');

  partIds = readInputPartIds();

  console.log('*** Retrieving part data...');

  for (let id of partIds) {
    if (id) {
      let data = await loadPartData(id);
      parsedParts.push(data);
    }
  };

  if (0 === parsedParts.length) {
    console.log(chalk.yellow('*** No part found. Exit.'));
    return false;
  }

  console.log('*** Retrieving part image...');

  for (let part of parsedParts) {
    if (part.data) {
      console.log(`Download image ${part.id}`);

      part.fileName = `${part.id}.jpg`;
      await downloadPartImage(part.data.sourceImageUrl, part.fileName);
    }
  };

  console.log('*** Uploading parts to store...');
  let count = await uploadParts(parsedParts);

  console.log(`*** Done. Uploaded ${count} of ${parsedParts.length} parts.`);
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
  };
}

function readInputPartIds() {
  let content = fs.readFileSync('parts.txt', { encoding: 'utf8' });
  let partIds = content.split(/\r?\n/);
  return partIds;
}

start();
