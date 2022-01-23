const getSavedCartItems = (chave = 'cartItems') => localStorage.getItem(chave);

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
