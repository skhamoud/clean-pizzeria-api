const makeProduct = require('../billing/product');
describe('Product Items', () => {

  const fieldsErr = (field="") => `Invalid or missing product fields : ${field}`.trim();

  const id = 'adasdfeqqre',
    id2 = '',
    id3 = 234;
  const title = 'title',
    title2 = '';
  const price = 12.90,
    price2 = '14.00'
  const thumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Pizza_pie.jpg/640px-Pizza_pie.jpg',
    thumbnail2 = 'notAUrl';

  test('Must have valid fields', () => {

    const cases = [
      { product: { title, price, thumbnail }, r: fieldsErr('id') },
      { product: { id: id2, title, price, thumbnail }, r: fieldsErr('id') },
      { product: { id: id3, title, price, thumbnail }, r: fieldsErr('id') },

      { product: { id, price, thumbnail }, r: fieldsErr('title') },
      { product: { id, title: title2, price, thumbnail }, r: fieldsErr('title') },

      { product: { id, title: 'title', thumbnail }, r: fieldsErr('price') },
      { product: { id, title: 'title', price: price2 , thumbnail}, r: fieldsErr('price') },

      { product: { id, title: 'title', price, }, r: fieldsErr('thumbnail') },
      { product: { id, title: 'title', price, thumbnail: thumbnail2 }, r: fieldsErr('thumbnail') },
    ];

    cases.forEach((c) => {
      expect(() => {
        makeProduct(c.product);
      }).toThrow(c.r);
    });
  });


  test('Returns an immutable product product', () => {
    const product = { id , title, price, thumbnail }
  
    expect(makeProduct(product)).toEqual(product)
  })
});
