module.exports = {
  post: jest.fn().mockImplementation((url, data) => Promise.resolve({
    status: 200,
    data: {
      id: data.id
    }
  }))
}
