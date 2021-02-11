const pizzaMenu = require('../../billing/dummy-products');

module.exports = {
  get(ctx, respond) {
    respond(200, { data : pizzaMenu });
  },
};
