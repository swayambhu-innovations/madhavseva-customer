export const environment = {
  firebase: {
    apiKey: 'AIzaSyCNL1sP4JPLNTDdVMD5wYq5iiYvoyBS5B0',
    authDomain: 'madhavseva-67565.firebaseapp.com',
    projectId: 'madhavseva-67565',
    storageBucket: 'madhavseva-67565.appspot.com',
    messagingSenderId: '997909671489',
    appId: '1:997909671489:web:ea88429ac0a6560e8fa0c0',
    measurementId: 'G-5BV7QY47F9',

    functionURL: 'https://us-central1-madhavseva-67565.cloudfunctions.net/',
  },

  cloudFunctions: {
    createOrder:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/createOrder',
    getOrderById:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/getOrderById?id=',
    capturePayment:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/capturePayments',

    authJMP: 'https://us-central1-madhavseva-67565.cloudfunctions.net/authJMP',
    intentJMP:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/intentJMP',

    paymentJMP:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/paymentJMP',

    statusJMP:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/statusJMP',

    validateJMP:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/S2SURL',

    createRefund:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/createRefund',
    getRefundDetails:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/getRefundDetails',
  },

  jioPayConfig: {
    MID: '100001007138007',
    clientId: 'c3ab8e9faafe6144f6ac97e686d4681a',
    clientSecret:
      '5272394b064440a09691cd6e6c6fed02889f33c96145e25f20b22f6b7149d35d',
    VPA: '2407362997229@jiopay',
  },

  RAZORPAY_KEY_ID: 'rzp_test_A9Kod2RLWyBi4k',
  RAZORPAY_DOMAIN:'https://api.razorpay.com/v1/',
  production: true
};
