const addProductsFactory = require('./addProducts')
const getCartFactory = require('./getCart')
const checkoutFactory = require('./checkout')
// ===== Repos =======
const cartRepo = require('../cartRepo')
const productRepo = require('../productRepo')
// ====== Helpers and services 
const stripe = require('../../infrastructure/services/stripe')

module.exports = {
  addProductsUseCase : addProductsFactory({cartRepo , productRepo }),
  getCartUseCase: getCartFactory({cartRepo}),
  checkoutUseCase: checkoutFactory({cartRepo,  paymentService: stripe})
}