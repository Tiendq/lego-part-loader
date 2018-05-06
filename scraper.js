let requestPromise = require('request-promise-native');
let cheerio = require('cheerio');

async function getPartData(partId) {
  try {
    let content = await loadPage(partId);
    let data = getFormattedData(parseContent(content));

    if (data)
      data.partId = partId;

    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function loadPage(partId) {
  let options = {
    url: `https://brickset.com/parts/${partId}`
  };

  return requestPromise(options).then(response => response);
}

function parseContent(content) {
  let $ = cheerio.load(content);
  let title = $('.content .main header > h1').text();

  if (!title)
    return null;

  let sourceImageUrl = $('.content .main > .partimage').attr('src');
  let properties = $('.content .featurebox .text dd');

  return {
    name: $(properties[1]).text(),
    designId: $(properties[2]).text(),
    colorFamily: $(properties[7]).text(),
    color: $(properties[8]).text(),
    rgb: $(properties[9]).find('span').text(),
    colorType: $(properties[10]).text(),
    legoColorId: $(properties[11]).text(),
    sourceImageUrl
  };
}

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
  };
}

module.exports = {
  getPartData
};
