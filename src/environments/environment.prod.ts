export const environment = {
  firebase: {
    apiKey: "AIzaSyBbNRIxV4pW5Vz3-IkQp7fg3keDJVZHYNc",
    authDomain: "turbanlaundry.firebaseapp.com",
    projectId: "turbanlaundry",
    storageBucket: "turbanlaundry.appspot.com",
    messagingSenderId: "595946248747",
    appId: "1:595946248747:web:767466559de5d7969a286e",
    measurementId: "G-Y07B97SZW2",

    functionURL: 'https://us-central1-turbanlaundry.cloudfunctions.net/',
  },

  cloudFunctions : {
    createOrder: 'https://us-central1-turbanlaundry.cloudfunctions.net/createOrder',
    getOrderById: 'https://us-central1-turbanlaundry.cloudfunctions.net/getOrderById?id=',
    capturePayment: 'https://us-central1-turbanlaundry.cloudfunctions.net/capturePayments',

    
    createRefund:'https://us-central1-turbanlaundry.cloudfunctions.net/createRefund',
    getRefundDetails:'https://us-central1-turbanlaundry.cloudfunctions.net/getRefundDetails',
  },

  RAZORPAY_KEY_ID: 'rzp_test_A9Kod2RLWyBi4k',
  RAZORPAY_DOMAIN:'https://api.razorpay.com/v1/',
  production: true
};
