const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getPartData } = require('./brickset');

test('should get part data successfully', async () => {
  axios.get.mockReturnValueOnce({
    data: fs.createReadStream(path.join(__dirname, './test/300121.html'))
  });

  const expectedData = {
    name: 'Brick 2X4',
    designId: '3001',
    colorFamily: 'Red',
    color: 'Bright Red',
    rgb: '#B40000',
    colorType: 'Solid',
    legoColorId: '21',
    imageUrl: 'https://www.lego.com/service/bricks/5/2/300121'
  }

  // https://brickset.com/parts/300121
  let part = await getPartData('300121');

  expect(part.data).toBeDefined();
  expect(part.data).toEqual(expectedData);
});

test('should return error for non-existent part', async () => {
  axios.get.mockReturnValueOnce({
    data: fs.createReadStream(path.join(__dirname, './test/123456.html'))
  });

  let part = await getPartData('123456');

  expect(part.error).toBeDefined();
  expect(part.error).toBe('Title not found, part ID might be incorrect');
});
