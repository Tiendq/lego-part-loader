const { JSDOM } = require('jsdom');

async function getPartData(partId) {
  try {
    let dom = await JSDOM.fromURL(`https://brickset.com/parts/${partId}`);
    let data = extractPartData(dom.window.document);

    if (typeof data === 'string') {
      console.error('Parsing error: ' + data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error: Could not load page');
    return null;
  }
}

function extractPartData(document) {
  let container = '.content .main';
  let title = document.querySelector(container + ' > header > h1');

  if (!title || 0 === title.textContent.length)
    return 'Title not found, part ID might be incorrect';

  let partImage = document.querySelector(container + ' > .partimage');

  if (!partImage)
    return 'Image not found';

  let details = document.querySelectorAll('.content .featurebox > .text dd');

  if (0 === details.length)
    return 'Part details not found';

  return {
    name: details[1].textContent,
    designId: details[2].textContent,
    colorFamily: details[7].textContent,
    color: details[8].textContent,
    rgb: details[9].children[0].textContent,
    colorType: details[10].textContent,
    legoColorId: details[11].textContent,
    imageUrl: partImage.src
  }
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
