export const environment = {
  firebase: {
    apiKey: "AIzaSyAtJsXpfRm_JYPRDIvXzswKE2mmmUY0V54",
  authDomain: "kittyconnect-68a81.firebaseapp.com",
  projectId: "kittyconnect-68a81",
  storageBucket: "kittyconnect-68a81.appspot.com",
  messagingSenderId: "672760272300",
  appId: "1:672760272300:web:183e680e6506acf349d609",
  measurementId: "G-6P5VCTFRMG",

    functionURL: 'https://us-central1-kittyconnect-68a81.cloudfunctions.net/',
  },

  cloudFunctions : {
    createOrder: 'https://us-central1-kittyconnect-68a81.cloudfunctions.net/createOrder',
    getOrderById: 'https://us-central1-kittyconnect-68a81.cloudfunctions.net/getOrderById?id=',
    capturePayment: 'https://us-central1-kittyconnect-68a81.cloudfunctions.net/capturePayments',

    
    createRefund:'https://us-central1-kittyconnect-68a81.cloudfunctions.net/createRefund',
    getRefundDetails:'https://us-central1-kittyconnect-68a81.cloudfunctions.net/getRefundDetails',
  },

  RAZORPAY_KEY_ID: 'rzp_test_A9Kod2RLWyBi4k',
  RAZORPAY_DOMAIN:'https://api.razorpay.com/v1/',
  production: true
};
