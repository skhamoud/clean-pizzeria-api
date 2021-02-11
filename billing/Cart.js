const Result = require('../core/Result');
const Product = require('./Product');
const { CartInvalidItemsErr } = require('./failures');
const failures = require('./failures');

function createCartFactory() {
  return Object.freeze({ from, create });

  /** Returns an empty cart entity, use the `addItems` method to add items
   * @param {"UserID"} userId
   */
  function create(userId) {
    return from({ userId, items: [] });
  }

  /** Cart factory 
   * @param {[item]} items
   */
  function from(cartDTO) {
    const { userId, items } = cartDTO;
    if (!items || !Array.isArray(items)) return Result.fail(CartInvalidItemsErr);

    // in the cart entity we store items as an object
    let _cartItems = {};
    // add the items here which also validates them
    const cartOrErr = addItems(items);
    if (cartOrErr.isFailure) return Result.fail(cartOrErr.error);

    return Result.ok(
      Object.freeze({
        userId,
        addItems,
        getItems,
        removeItems,
        clear,
        getSubTotal,
        model,
        json: model,
      })
    );

    function model() {
      return Object.freeze({
        userId,
        items: getItems(),
        subTotal: getSubTotal(),
      });
    }
    /** Removes items from the cart
     * @param {string | array} itemIds id or array of ids of items to remove from the cart
     * @returns {Result.Result}
     */
    function removeItems(itemIds) {
      // ignore if no ids specified
      if (!itemIds) return Result.ok();
      // handle case for single item vs an array
      itemIds = Array.isArray(itemIds) ? itemIds : [itemIds];
      try {
        itemIds.forEach((itemId) => {
          delete _cartItems[itemId];
        });
        return Result.ok();
      } catch (error) {
        return Result.fail(failures.CartNoItemsErr);
      }
    }

    /** Clears the cart from everything in it */
    function clear(){
      _cartItems = {}
    }
    /** Gets the current items in the cart
     * @returns {[Item]}
     */
    function getItems() {
      return Object.values(_cartItems);
    }
    /** Adds items to cart, includes validation inside
     * @param {[Item]} list
     * @returns {Result.Result}
     */
    function addItems(list) {
      for (let ii = 0, _len = list.length; ii < _len; ii++) {
        const  _item = list[ii]
        // get each product wih it's quantity
        // validate by using product entity on it and making sure it has a quantity
        const qty = _item.quantity;
        if (!qty || typeof qty != 'number' || qty < 1) return Result.fail(CartInvalidItemsErr);
        // make sure it has all "product" valid fields
        const _pOrErr = Product.from(_item);
        if (_pOrErr.isFailure) return Result.fail(CartInvalidItemsErr);
        // check if we have it already in the cart
        if (_cartItems[_item.id]) {
          // if yes then simply update the qty
          _cartItems[_item.id].quantity += qty;
        } else {
          // and add it to cart
          _cartItems[_item.id] = { ..._pOrErr.value.model(), quantity: qty };
        }
      }
      return Result.ok();
    }

    /** Gets the cart subtotal
     * @return {number}
     */
    function getSubTotal() {
      return Object.values(_cartItems).reduce((total, product) => (total += product.price * product.quantity), 0);
    }
  }
}
/** @typedef Item
 * @type {object}
 * @property {string} id
 * @property {number} quantity
 * @property {number} price
 * @property {string} thumbnail
 * {id, quantity, price, thumbnail}
 */
module.exports = createCartFactory();
