require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');


describe('1 - Teste a função fecthProducts', () => {
  // implemente seus testes aqui
  it ('fetchProducts é uma função', () => {
    expect(typeof fetchProducts).toBe('function');
  });
  it ('A função fetch está sendo chamada', async () => {
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
  });
  it ('Ao chamar a função fetchProducts com o argumento "computador", a função fetch utiliza o endpoint correto', async () => {
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  });
  it ('A função fetchProducts está retornando o objeto correto', async () => {
    const obj = await fetchProducts('computador');
    expect(obj).toEqual(computadorSearch);
  });
  it ('Caso a função fetchProducts seja chamada sem argumentos, retorna um erro', async () => {
    try {
      await fetchProducts();
    }
    catch (e) {
      const expectedObject = new Error('You must provide an url');
      expect(e).toEqual(expectedObject);
    }
  });
});
