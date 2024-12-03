// __mocks__/axios.js
const mockAxios = jest.genMockFromModule('axios');

mockAxios.post = jest.fn(() => Promise.resolve(mockLoginResponse));

export default mockAxios;