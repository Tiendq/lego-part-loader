const fs = require('fs');
const path = require('path');
const requestPromise = require('request-promise-native');
const chalk = require('chalk');

let log = console.log;

async function uploadPart(part) {
  let uploadedImage = await uploadImage(part.fileName);

  if (uploadedImage) {
    log(chalk.green(`Upload image ${part.id} successfully to ${uploadedImage.imageUrl}`));

    let result = await uploadData({
      ...part.data,
      imageUrl: uploadedImage.imageUrl
    });

    if (result) {
      if (result.error) {
        log(chalk.yellow(result.error));
      } else {
        log(chalk.green(`Upload part ${part.id} success`));
      }
    } else {
      log(chalk.red(`Failed upload part ${part.id}.`));
    }
  } else {
    log(chalk.red(`Failed upload part image ${part.id}. Ignore this part.`));
  }
}

function uploadImage(fileName) {
  let options = {
    method: 'POST',
    url: `${process.env.STORE_URL}/upload/part`,
    headers: {
      'Access-Token': process.env.ACCESS_TOKEN
    },
    formData: {
      image: {
        value: fs.createReadStream(fileName),
        options: {
          filename: path.basename(fileName),
          contentType: 'image/jpg'
        }
      }
    },
    json: true,
    simple: false,
    resolveWithFullResponse: true
  }

  return requestPromise(options)
    .then(response => {
      return 200 === response.statusCode ? response.body : null;
    })
    .catch(error => {
      log(chalk.red(error.message));
      return null;
    });
}

function uploadData(part) {
  let options = {
    method: 'POST',
    url: `${process.env.STORE_URL}/api/part`,
    headers: {
      'Access-Token': process.env.ACCESS_TOKEN
    },
    body: {
      ...part,
      category: '1000',
      active: false,
      price: 0,
      inventory: 0,
      createdDate: new Date()
    },
    json: true,
    simple: false,
    resolveWithFullResponse: true
  }

  return requestPromise(options)
    .then(response => {
      return 200 === response.statusCode ? response.body : null;
    })
    .catch(error => {
      log(chalk.red(error.message));
      return null;
    });
}

module.exports = {
  uploadPart
}
