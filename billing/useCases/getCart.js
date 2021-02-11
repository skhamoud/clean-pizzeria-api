const Result = require('../../core/Result');
const Cart = require('../Cart');

module.exports = function getCartFactory({ cartRepo }) {
  // requires user id , and items of nature [{productId: 20jads0q2, qty: 2}, ...]
  return async function getCart(userId) {
    // get the user's cart from the user's id
    const cartModel = await cartRepo.getCart(userId);
    if(!cartModel) return Result.fail({name : 'no cart', message : 'no cart'})
    const cartOrErr = Cart.from(cartModel) ;
    if (cartOrErr.isFailure) return Result.fail(cartOrErr.error);

    return Result.ok(cartOrErr.value.json());

  };
};
