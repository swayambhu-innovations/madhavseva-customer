// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
