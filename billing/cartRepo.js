const fileDB = require('../infrastructure/db/fileDB');
// gets the db as a dep
// has all db cart related ops

function createCartRepo({ db = fileDB }) {
  return Object.freeze({
    createCart,
    getCart,
    saveCart,
  });

  async function getCart(id) {
    try {
      return await db.read('carts', id);
    } catch (error) {
      return null;
    }
  }
  
  async function createCart(cart) {
    try {
      return await db.create('carts', cart.userId, cart.model());
    } catch (err) {
      return null;
    }
  }
  
  async function saveCart(cart) {
    try {
      return await db.update('carts', cart.userId, cart.model());
    } catch (err) {
      return null;
    }
  }
}

module.exports = createCartRepo({ db: fileDB });
