// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

    payJM: 'https://us-central1-madhavseva-67565.cloudfunctions.net/payJM',

    authIntentJm:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/authIntentJm',

      authJMP: 'https://us-central1-madhavseva-67565.cloudfunctions.net/authJMP',
    intentJMP: 'https://us-central1-madhavseva-67565.cloudfunctions.net/intentJMP',

    // createSubscription: 'https://us-central1-jaipurservicecompany.cloudfunctions.net/createSubscription',
    // verifySubscription:'https://us-central1-jaipurservicecompany.cloudfunctions.net/verifySubscription',
    // checkSubscriptionStatus:'https://us-central1-jaipurservicecompany.cloudfunctions.net/checkSubscriptionStatus',

    createRefund:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/createRefund',
    getRefundDetails:
      'https://us-central1-madhavseva-67565.cloudfunctions.net/getRefundDetails',
  },

  RAZORPAY_KEY_ID: 'rzp_test_A9Kod2RLWyBi4k',
  RAZORPAY_DOMAIN: 'https://api.razorpay.com/v1/',
  production: false,
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
