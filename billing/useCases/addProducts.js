const Cart = require('../Cart');
const Result = require('../../core/Result');
const appFailures = require('../../core/failures');
const { CartNoProductsErr } = require('../failures');
const failures = require('../../core/failures');
const { keyBy } = require('../../lib/helpers');

module.exports = function addProductsFactory({ cartRepo, productRepo }) {
  // requires user id , and items of nature [{productId: 20jads0q2, qty: 2}, ...]
  return async function addProductsToCart(userId, items) {
    if (!userId || typeof userId != 'string' || userId.length < 30) return Result.fail(appFailures.UNEXPECTED);
    // TODO Make sure the products exist
    const products = await productRepo.getProducts(items.map((i) => i.id));
    // if no products return appropriate failure
    if (!products) return Result.fail(CartNoProductsErr);

    // get the user's cart from the user's id
    const cartModel = await cartRepo.getCart(userId);
    // if not found, we should create one
    const cartOrErr = !cartModel ? Cart.create(userId) : Cart.from(cartModel);
    if (cartOrErr.isFailure) return Result.fail(cartOrErr.error);

    // add the incoming items
    const productsObj = keyBy(products);

    const cart = cartOrErr.value;
    const updatedListOrErr = cart.addItems(items.map((itm) => ({ ...productsObj[itm.id], quantity: itm.quantity })));
    if (updatedListOrErr.isFailure) return Result.fail(updatedListOrErr.error);

    // persist , create in db if never made and save otherwise
    const persistCart = cartModel ? cartRepo.saveCart : cartRepo.createCart;
    if (await persistCart(cart)) {
      // saved in DB, return it
      return Result.ok(cart.json());
      // failed saving
    } else return Result.fail(failures.UNEXPECTED);
  };
};
