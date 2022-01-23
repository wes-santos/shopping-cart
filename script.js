// Captura dos elementos do DOM que vão ser manipulados
const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const subtotal = document.querySelector('.total-price');

// Variável para armazenar o preço dos itens que são colocados no carrinho
let total = 0;
const products = {};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Função para pegar o preço dada uma variável contendo a frase com o preço
// e uma variável para armazenar o valor
const getPrice = (content, price) => {
  content.forEach((element, index) => {
    if (element === '$') {
      for (i = index; i < content.length; i += 1) {
        price.push(content[i]);
      }
    }
  });
};

// Função para atualizar o preço de forma correta
// Consultei o MDN para utilização do método substring():
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/substring#parameters
const checkPrice = (price) => {
  const result1 = price.substring(price.length - 2);
  const result2 = price.substring(price.length - 1);
  if (result1 === '00') {
    return parseFloat(price).toFixed();
  }
  if (result2 === '0') {
    return parseFloat(price).toFixed(1);
  }
  return parseFloat(price).toFixed(2);
};

// Função para pegar apenas o preço presente no Subtotal
const extractPriceFromSubtotal = () => {
  const content = localStorage.getItem('totalPrice');
  return parseFloat(content);
};

// Variável para pegar a chave que guarda o preço no localStorage
const totalPriceLocalStorage = localStorage.getItem('totalPrice');

// Condição para atualizar o valor da variável global de preço caso haja algum
// preço armazenado no localStorage
if (totalPriceLocalStorage !== null) {
  total = extractPriceFromSubtotal();
}

// Função para pegar o preço do texto que está no carrinho
const extractPriceFromLi = (event) => {
  const price = [];
  const content = event.target.innerText.split('');
  getPrice(content, price);
  price.shift();
  const result = price.join('');
  return parseFloat(result);
};

// Função para diminuir o preço do Subtotal quando remover um item do carrinho
const removePrice = (price) => {
  total -= price;
  if (cartItems !== null) {
    subtotal.innerText = checkPrice(total.toFixed(2));
  }
  if (total === -9.094947017729282e-13) {
    subtotal.innerText = checkPrice(total.toFixed(2));
  }
};

// Função para adicionar o preço atual do Subtotal ao localStorage
const addPriceToLocalStorage = () => {
  products.totalPrice = subtotal.innerText;
  localStorage.setItem('totalPrice', products.totalPrice);
};

// Função para pegar o preço armazenado no localStorage
const getPriceFromLocalStorage = () => {
  const totalPrice = localStorage.getItem('totalPrice');
  if (totalPrice !== null) {
    subtotal.innerText = totalPrice;
  }
};

// Função para definir o que acontece ao clicar em um item do carrinho
function cartItemClickListener(event) {
 event.target.parentElement.removeChild(event.target);
 saveCartItems('cartItems', cartItems.innerHTML);
 removePrice(extractPriceFromLi(event));
 addPriceToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função para atualizar o preço do Subtotal
const addPrice = async (price) => {
  total += price;
  if (cartItems !== null) {
    subtotal.innerText = checkPrice(total.toFixed(2));
  }
  if (total === -9.094947017729282e-13) {
    subtotal.innerText = checkPrice(total.toFixed(2));
  }
};

// Função para colocar o produto no carrinho
const putProductInCart = async () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const clickedElementId = event.target.parentElement.firstElementChild.innerHTML;
      const result = await fetchItem(clickedElementId);
      const { id: sku, title: name, price: salePrice } = result;
      const product = createCartItemElement({ sku, name, salePrice });
      cartItems.appendChild(product);
      addPrice(salePrice);
      saveCartItems('cartItems', product.parentElement.innerHTML);
      addPriceToLocalStorage();
    });
  });
};

// Função para criar texto de carregando para ser colocado na página
const createLoader = () => {
  const p = document.createElement('p');
  p.className = 'loading';
  p.innerText = 'Carregando';
  return p;
};

// Função para colocar texto de carregando na página enquanto consulta API
const putLoaderOnStage = () => {
  const loader = createLoader();
  items.appendChild(loader);
};

// Função para remover o texto de carregando
const removeLoaderFromStage = () => {
  const loader = document.querySelector('.loading');
  items.removeChild(loader);
};

// Função para colocar os produtos na página
const putProductsOnStage = async () => {
  putLoaderOnStage();
  const data = await fetchProducts('computador');
  removeLoaderFromStage();
  const { results } = data;
  results
    .map((obj) => ({ sku: obj.id, name: obj.title, image: obj.thumbnail }))
    .forEach((obj) => {
      items.appendChild(createProductItemElement(obj));
    });
  putProductInCart();
};

// Função para limpar o carrinho
const emptyCart = () => {
  const button = document.querySelector('.empty-cart');
  const list = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    list.innerHTML = '';
    total = 0;
    subtotal.innerText = 0;
    addPriceToLocalStorage();
    saveCartItems('cartItems', cartItems.innerHTML);
  });
};

window.onload = () => {
  putProductsOnStage();
  emptyCart();
  if (getSavedCartItems('cartItems') !== undefined) {
    cartItems.innerHTML = getSavedCartItems('cartItems');
    cartItems.childNodes.forEach((element) => element
      .addEventListener('click', cartItemClickListener));
  }
  getPriceFromLocalStorage();
};
