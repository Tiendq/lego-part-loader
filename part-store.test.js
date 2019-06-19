// jest.mock('axios');

// const axios = require('axios');
const { uploadPart } = require('./part-store');

test('should upload part successfully', async () => {
  /*axios.post.mockImplementation(() => Promise.resolve({
    status: 200,
    data: {
      id: '300121'
    }
  }));*/

  const data = {
    id: '300121',
    name: 'Brick 2X4',
    designId: '3001',
    colorFamily: 'Red',
    color: 'Bright Red',
    rgb: '#B40000',
    colorType: 'Solid',
    legoColorId: '21',
    imageUrl: 'https://www.lego.com/service/bricks/5/2/300121'
  }

  let result = await uploadPart(data);

  // expect(axios.post).toBeCalled();
  // expect(axios.post).toBeCalledTimes(1);
});
