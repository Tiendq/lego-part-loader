const fs = require('fs');
const path = require('path');
const requestPromise = require('request-promise-native');
const chalk = require('chalk');
const axios = require('axios');

let log = console.log;

async function uploadPart(part) {
  // let uploadedImage = await uploadImage(part.fileName);
  let uploadedImage = {
    imageUrl: 'https://localhost/test.png'
  }

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

async function uploadData(part) {
  let options = {
    headers: {
      'Access-Token': process.env.ACCESS_TOKEN
    }
  }

  let data = {
    ...part,
    category: '1000',
    active: false,
    price: 0,
    inventory: 0,
    createdDate: new Date()
  }

  try {
    let response = await axios.post(`${process.env.API_URL}/parts`, data, options);

    if (200 === response.status)
      return response.data;
    else
      return null;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx.
      console.error(error.response.data);
      console.error(error.response.status);
    }

    console.error(error.message);
    return null;
  }
}

module.exports = {
  uploadPart
}
