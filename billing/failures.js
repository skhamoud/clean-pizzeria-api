const CartInvalidItemsErr = { name: 'CartInvalidItems', message: 'Invalid items in Cart' };
const CartNoItemsErr = { name: 'NoItems', message: 'Some or all of the items were not found' };
const PAYMENTFAILED = {
  name: 'PaymentFailed',
  message: 'Checkout failed',
  create(error) {
    return { name: 'PaymentFailed', message: error.message || error};
  },
};
module.exports = {
  CartInvalidItemsErr,
  CartNoItemsErr,
  PAYMENTFAILED,
};
