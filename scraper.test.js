const { getPartData } = require('./scraper');

// https://brickset.com/parts/300121
const TEST_PART_ID = '300121';

test('should load part data correctly', async () => {
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

  let part = await getPartData(TEST_PART_ID);

  expect(part).not.toBeNull();
  expect(part).toEqual(expectedData);
});

test('should return error for incorrect part ID', async () => {
  let part = await getPartData('123456');
  expect(part).toBeNull();
});
