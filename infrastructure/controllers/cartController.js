const failures = require('../../core/failures');
const { addProductsUseCase, getCartUseCase, checkoutUseCase } = require('../../billing/useCases');

module.exports = {
  /** Add Products to cart
   * *authenticated
   * Required : items[products] like so { id, name, thumbnail, etc... , quantity }
   */
  async post(ctx, respond) {
    const {
      auth,
      body: { items },
    } = ctx;
    try {
      const updatedCartOrErr = await addProductsUseCase(auth.id, items);
      if (updatedCartOrErr.isSuccess) respond(200, { message: 'successfully added items to the cart' });
      else {
        respond(400, { err: updatedCartOrErr.error.message });
      }
      // TODO handle accroding to failure nature
    } catch (error) {
      respond(500, { err: failures.create(error).message });
    }
  },
  /** Gets the cart and the items in it
   *
   */
  async get(ctx, respond) {
    const { auth } = ctx;
    try {
      const cartOrErr = await getCartUseCase(auth.id);
      if (cartOrErr.isSuccess) respond(200, { success: true, cart: cartOrErr.value });
      else respond(400, { err: cartOrErr.error.message });
    } catch (error) {
      respond(500, { err: failures.create(error).message });
    }
  },

  /** Checkout process
   */
  async checkout(ctx, respond) {
    const { auth, body } = ctx;
    // console.log(JSON.stringify(body))
    try {
      const paymentOrErr = await checkoutUseCase(auth.id, body.card);
      if (paymentOrErr.isSuccess) respond(200, { success: true, data: paymentOrErr.value });
      else respond(400, { err: paymentOrErr.error.message });
    } catch (error) {
      respond(500, { err: failures.create(error).message });
    }
  },
};
