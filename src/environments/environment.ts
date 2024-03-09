// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  production: false
};
//
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
