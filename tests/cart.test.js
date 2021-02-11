const makeCart = require('../billing/Cart/Cart');
describe('cart', () => {
  const item1 = { id: '23231064', title: 'product 3', price: 630 , thumbnail: "https://mockedUrl.com"};
  const item2 = { id: '234234', title: 'product 1', price: 300, thumbnail: "https://mockedUrl.com" };
  const item3 = { id: '5957457', title: 'product 2', price: 100 , thumbnail: "https://mockedUrl.com"};

  test('get items in cart', () => {
    const cart = makeCart([item2, item3])
    expect(cart.getItems()).toEqual([item2, item3])
    
    const cart2 = makeCart()
    expect(cart2.getItems()).toEqual([])

  });
  
  test('adds items to cart', () => {
    const cart = makeCart([item2])
    cart.addItem(item1)
    expect(cart.getItems()).toEqual([item2, item1])
  });
  
  test('removes  single item from cart', () => {
    const cart = makeCart([item2, item3])
    cart.removeItems(item2.id)

    expect(cart.getItems()).toEqual([item3])
  });
  
  test('removes multiple items from cart', () => {
    const cart = makeCart([item2, item3, item1])
    cart.removeItems([item2.id, item1.id])

    expect(cart.getItems()).toEqual([item3])
  });

  test('Gets sub total of items in cart', () => {
    const cart = makeCart([item2, item3])
    cart.getSubTotal()

    expect(cart.getSubTotal()).toBe(item3.price + item2.price)
  });

  
});
