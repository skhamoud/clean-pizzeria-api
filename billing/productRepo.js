const products = require('./dummy-products');
// Since it's dummy products data in the catalog there's no need for factories or DB ops
module.exports = {
  getProducts(idsArray) {
    const found = products.filter((p) => idsArray.includes(p.id));
    return Promise.resolve(found);
  },
  getProduct(id) {
    const found = products.filter((p) => id == p.id);
    return Promise.resolve(found);
  },
};
