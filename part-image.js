let requestPromise = require('request-promise-native');
let fs = require('fs');

async function downloadPartImage(url, fileName) {
  let options = {
    url,
    uri: url,
    encoding: null
  };

  return requestPromise(options).then(response => {
    let buffer = Buffer.from(response, 'utf8');
    fs.writeFileSync(`temp/${fileName}`, buffer);
  }); // .catch(error => console.log(error));
}

module.exports = {
  downloadPartImage
};
