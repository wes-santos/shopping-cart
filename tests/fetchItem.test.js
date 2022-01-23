require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  // implemente seus testes aqui
  it ('fetchItem é uma função', () => {
    expect(typeof fetchItem).toBe('function');
  });
  it ('A função fetch está sendo chamada ao passar um id para fetchItem', async () => {
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  });
  it ('A função fetch retorna o endpoint correto ao receber um id', async () => {
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1615760527');
  });
  it ('Ao receber um id, a função fetchItem retorna o objeto esperado', async () => {
    const response = await fetchItem('MLB1615760527');
    expect(response).toEqual(item);
  });
  it ('Quando não recebe argumento, a função fetchItem retorna um erro', async () => {
    try {
      await fetchItem();
    }
    catch (e) {
      const errorObject = new Error('You must provide an url');
      expect(e).toEqual(errorObject);
    }
  });
});
