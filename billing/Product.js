const { jsonParser, deepCopy } = require('../lib/helpers');
const Result = require('../core/Result');
const { validator } = require('../lib/validator');

function createProductFactory({ validator, deepCopy }) {
  return Object.freeze({ create, from });

  function create(DTO) {
    // create id
    // construct the productDTO
    // and return from(productDTO)
  }

  /** Item Factory  */
  function from({ id, name, price, thumbnail }) {
    const validationErrs = validator(arguments[0], {
      id: 'required|string',
      name: 'required|string',
      price: 'required|number',
      thumbnail: 'required|url',
    });

    if (validationErrs.length > 0) {
      return Result.fail({ name: 'ProductInvalidFields', message: 'Invalid Product Properties' });
    }

    const _product = { id, name, price, thumbnail };

    function model() {
      return deepCopy(_product);
    }
    
    return Result.ok(Object.freeze({ ...deepCopy(_product), json : model, model }));
  }
}
module.exports = createProductFactory({ validator, deepCopy });
