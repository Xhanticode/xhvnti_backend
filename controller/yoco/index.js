const axios = require('axios')

// Anonymous test key. Replace with your key.
const SECRET_KEY = process.env.TEST_SECRET_KEY

axios.post(
  'https://online.yoco.com/v1/charges/',
  {
    token: 'tok_test_DjaqoUgmzwYkwesr3euMxyUV4g',
    amountInCents: 2799,
    currency: 'ZAR',
  },
  {
    headers: {
      'X-Auth-Secret-Key': SECRET_KEY,
    },
  },
)
.then(res => {
  // res.status will contain the HTTP status code
  // res.data will contain the response body
})
.catch(error => {
  // handle errors
})

// Refunds 

// axios.post(
//   'https://online.yoco.com/v1/refunds/',
//   {
//     'chargeId' => 'ch_xpnGtOMMObOw',
//   },
//   {
//     headers: {
//       'X-Auth-Secret-Key': SECRET_KEY,
//     },
//   },
// )
// .then(res => {
//   // res.status will contain the HTTP status code
//   // res.data will contain the response body
// })
// .catch(error => {
//   // handle errors
// })

modules.export