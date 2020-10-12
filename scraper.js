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

  // 2020-10-12: Image link is stored in an A tag.
  // <a href="/ajax/parts/mainImage?image=https%3a%2f%2fwww.lego.com%2fcdn%2fproduct-assets%2felement.img.lod5photo.192x192%2f6113039.jpg">Image</a>
  let imageHref = $('.aside.tabs.top a')[0].attribs['href'];
  // console.log(imageHref);
  let x = imageHref.indexOf('?image=');
  let sourceImageUrl = imageHref.slice(x + '?image='.length);
  let properties = $('.content .featurebox .text dd');

  // for (i = 0; i < properties.length; ++i)
    // console.log(i, $(properties[i]).text());

  let data = {
    name: $(properties[1]).text(),
    designId: $(properties[2]).text(),
    colorFamily: $(properties[6]).text(),
    color: $(properties[7]).text(),
    rgb: $(properties[8]).text().slice(1,8),
    colorType: $(properties[9]).text(),
    legoColorId: $(properties[10]).text(),
    sourceImageUrl: decodeURIComponent(sourceImageUrl)
  };

  // console.log(data);
  return data;
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
