const Result = require('../../core/Result');
const failures = require('../../core/failures');
const Cart = require('../Cart');
const { PAYMENTFAILED } = require('../failures.js');

function checkoutFactory({ cartRepo, orderRepo, paymentService }) {
  // TODO clear the cart after payement success
  // TODO save the order before returning
  return async function checkout(userId, cardDetails) {
    const cartOrError = Cart.from(await cartRepo.getCart(userId));
    if (cartOrError.isFailure) return Result.fail(failures.UNEXPECTED);
    const cart = cartOrError.value;
    // trigger payment made from cart subtotal and details if relevant
    try {
      const payment = await paymentService.makePayment(cart, cardDetails);
      if (!payment) return Result.fail(PAYMENTFAILED);
      if (payment && payment.status === 'succeeded') {
        // TODO Create order
          // create order with items from cart, payment details and save it

        // clear cart 
        cart.clear()
        await cartRepo.saveCart(cart)
        return Result.ok({  details: payment});
      } else {
        return Result.fail(PAYMENTFAILED)
      }
    } catch (error) {
//      return Result.fail(PAYMENTFAILED.create(error));
        throw error
    }
  };
}

module.exports = checkoutFactory;
