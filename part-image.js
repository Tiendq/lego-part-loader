const fs = require('fs');
const requestPromise = require('request-promise-native');

async function downloadPartImage(url, fileName) {
  let options = {
    url,
    encoding: null
  }

  return requestPromise(options).then(response => {
    let buffer = Buffer.from(response, 'utf8');
    fs.writeFileSync(fileName, buffer);
  });
}

module.exports = {
  downloadPartImage
}
