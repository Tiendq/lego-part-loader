module.exports = {
  get: jest.fn(),
  post: jest.fn().mockImplementation((url, data) => Promise.resolve({
    status: 200,
    data: {
      id: data.id
    }
  }))
}
