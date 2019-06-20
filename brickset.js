const axios = require('axios');
const { JSDOM } = require('jsdom');

async function loadPartPage(partId) {
  let response = await axios.get(`https://brickset.com/parts/${partId}`, {
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    let html = [];

    response.data.on('data', (data) => html.push(data));
    response.data.on('end', () => resolve(html.join('')));
    response.data.on('error', (error) => reject(error));
  });
}

async function extractPartData(html) {
  let dom = new JSDOM(html);
  let document = dom.window.document;

  let container = '.content .main';
  let title = document.querySelector(container + ' > header > h1');

  if (!title || 0 === title.textContent.length)
    return { error: 'Title not found, part ID might be incorrect' };

  let partImage = document.querySelector(container + ' > .partimage');

  if (!partImage)
    return { error: 'Image not found' };

  let details = document.querySelectorAll('.content .featurebox > .text dd');

  if (0 === details.length)
    return { error: 'Part details not found' };

  let data = {
    name: details[1].textContent,
    designId: details[2].textContent,
    colorFamily: details[7].textContent,
    color: details[8].textContent,
    rgb: details[9].children[0].textContent,
    colorType: details[10].textContent,
    legoColorId: details[11].textContent,
    imageUrl: partImage.src
  }

  return { data }
}

async function getPartData(partId) {
  let html = await loadPartPage(partId);
  let part = await extractPartData(html);

  return part;
}

/*
function getFormattedData(data) {
  if (!data)
    return null;

  return {
    name: data.name,
    designId: data.designId,
    color: {
      name: data.color,
      family: data.colorFamily,
      code: data.rgb,
      type: data.colorType,
      legoId: Number(data.legoColorId)
    },
    sourceImageUrl: data.sourceImageUrl
  }
}
*/

module.exports = {
  getPartData
}
