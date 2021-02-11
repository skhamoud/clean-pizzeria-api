const config = require('../../config');
const hit = require('../../lib/hit');

const base_url = 'https://api.stripe.com/v1';
const auth = config.STRIPE_SECRET;

module.exports = Object.freeze({
    makePayment,
    getEvent,
});

/** Initiates the payment and handles it all */

async function makePayment(cart, cardDetails) {
  try {
    const paymentMethod = await _addPaymentMethod(cardDetails)
    const res = await hit.post(base_url + '/payment_intents', {
      auth,
      body: {
          amount: Math.floor(cart.getSubTotal() * 100),
          currency: 'usd',
          'payment_method_types[]': 'card',
          'payment_method': paymentMethod.id,
          confirm: true
          
      },
    });

    return res.data;
  } catch (error) {
    // // error from stripe
    throw error.data || error.error;
  }
}
// TODO 
async function _addPaymentMethod(cardDetails){
    try{
        const res = await hit.post(base_url + '/payment_methods' , {
            auth,
            body : {
                type: 'card',
                "card[number]": cardDetails.number,
                "card[exp_month]" : cardDetails.exp_month,
                "card[exp_year]": cardDetails.exp_year,
                "card[cvc]": cardDetails.cvc 
            }
        })
        return res.data
    } catch (e)  {
        throw e.data || e.error
    }
}

//TODO fix this 
async function getEvent(eventId) {
  return hit(base_url + `/events/${eventId}`);
}

