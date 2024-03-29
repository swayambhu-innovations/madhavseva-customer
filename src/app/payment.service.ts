import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Checkout } from 'capacitor-razorpay';
import { AlertsAndNotificationsService } from './alerts-and-notifications.service';
import { DataProviderService } from './core/data-provider.service';
import {
  CreateOrder,
  CreateRefund,
} from './authorized/models/payment.structure';
import { LoadingController } from '@ionic/angular';
const axios = require('axios').default;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private https: HttpClient,
    private alertify: AlertsAndNotificationsService,
    private loadingController: LoadingController,
    private dataProvider: DataProviderService
  ) {}
  WindowRef: any;
  orders: any[] = [];
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      Accept: '*/*',
      'Content-Type': 'application/json',
    }),
  };
  orderDetails: any;
  get MainWindowRef() {
    return this.WindowRef;
  }

  generateIdempotentKey() {
    return Math.random() * 5123 * 43 + 10;
  }

  generateInvoiceNumber() {
    return `INV${Date.now().toString()}`;
  }

  generateRecipetNumber() {
    return `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
  }

  async authJM(booking: booking) {
    let _headers = {
      'x-trace-id': '01c570cf-2bdf-49d0-a126-baec7038bbd1',
    };
    try {
      const { data } = await axios({
        method: 'post',
        url: 'https://pp-apig.jiomoney.com/jfs/v1/app/authenticate',
        headers: _headers,
        data: {
          application: {
            clientId: '988f2f4e55ec3843fa12d6b8e25338f8',
          },
          authenticateList: [
            {
              mode: 22,
              value:
                '255aaf0bd759d72de9f916660eb52bd6f610516aa4c63e480e382d5894e0fa30',
            },
          ],
          scope: 'SESSION',
          purpose: 2,
        },
      });
      const resData = await this.intentJM(booking, data);
      return resData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async intentJM(booking: booking, authdata: any) {
    let _headers = {
      'x-trace-id': '01c570cf-2bdf-49d0-a126-baec7038bbd1',
      'x-app-access-token': authdata.session.accessToken.tokenValue,
      'x-appid-token': authdata.session.appIdentifierToken,
    };

    // let orderDetails: CreateOrder = {
    //   amount: Math.round(booking.grandTotal! * 100),
    //   receipt: this.generateRecipetNumber(),
    //   currency: 'INR',
    //   notes: {},
    // };

    booking.user.phone = booking.user.phone?.replace(/\D/g, '').slice(-10);
    const date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    try {
      const { data } = await axios({
        method: 'post',
        url: 'https://pp-apig.jiomoney.com/payments/jfs/v1/payments/intent',
        headers: _headers,
        data: {
          transaction: {
            idempotentKey: this.generateIdempotentKey().toString(),
            invoice: this.generateInvoiceNumber(),
            initiatingEntityTimestamp: date.toISOString(),
            initiatingEntity: {
              returnUrl:
                'https://psp-mandate-merchant-sit.jiomoney.com:3003/merchantsimulator/pp/merchantstatus',
            },
          },
          amount: {
            netAmount: Math.round(booking.grandTotal! * 100),
          },
          payer: {
            externalId: this.generateRecipetNumber(),
            name: 'Atul Singh',
            email: booking.user?.email || 'temp@gmail.com',
            mobile: {
              number: booking.user.phone,
              countryCode: '91',
            },
          },
          payee: {
            merchantId: '100001000233342',
          },
          checkout: {
            template: {
              id: '',
            },
            notAllowed: [
              {
                methodType: '110',
                methodSubType: '580',
              },
            ],
          },
        },
      });
      console.log(data);
      const retData: any = {
        MID: '100001000233342',
        intentID: data.transaction.intentId,
        authdata: authdata,
      };
      this.payJm('100001000233342', data.transaction.intentId, authdata);
      return retData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async payJm(MID: string, intentID: string, authdata: any) {
    let _headers = {
      'x-trace-id': '01c570cf-2bdf-49d0-a126-baec7038bbd1',
      'x-app-access-token': authdata.session.accessToken.tokenValue,
      'x-appid-token': authdata.session.appIdentifierToken,
    };
    try {
      const { data } = await axios({
        method: 'post',
        url: 'https://pp-checkout.jiopay.com:8443',
        headers: _headers,
        data: {
          merchantID: MID,
          appidtoken: authdata.session.appIdentifierToken,
          appaccesstoken: authdata.session.accessToken.tokenValue,
          intentid: intentID,
          brandColor: '#ffc670',
          bodyBgColor: '#ffc670',
        },
      });
      console.log(data)
    } catch (err) {
      console.log(err);
    }
  }

  // Step 1 of Payment Flow
  handlePayment(data: booking) {
    this.WindowRef = window;
    var result: Subject<any> = new Subject();
    // var ref = this;
    // function preparePaymentDetails(
    //   order: any,
    //   orderDetails: booking,
    //   result: Subject<any>
    // ) {
    //   return {
    //     key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    //     amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
    //     name: 'Pay',
    //     currency: order.currency,
    //     // order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
    //     image: 'https://shreeva.com/images/logo.png',
    //     handler: function (response: any) {
    //       ref.finalizePayment(response, result);
    //     },
    //     modal: {
    //       ondismiss: function () {
    //         result.next({
    //           ...orderDetails,
    //           ...order,
    //           stage: 'paymentGatewayClosed',
    //         });
    //       },
    //     },
    //     prefill: {
    //       name: orderDetails.user.displayName,
    //       contact: orderDetails.user.phone,
    //     },
    //     theme: {
    //       color: '#ffc670',
    //     },
    //   };
    // }
    let orderDetails: CreateOrder = {
      amount: Math.round(data.grandTotal! * 100),
      receipt: this.generateRecipetNumber(),
      currency: 'INR',
      notes: {},
    };
    this.createOrder(orderDetails).subscribe(
      (order: any) => {
        this.payWithRazorpay(order, data, result);
      },
      (error) => {
        //console.log(JSON.stringify(error.message), "error");
        result.next({ ...orderDetails, stage: 'paymentGatewayError' });
      },
      () => {
        // completed
        // console.log("error............... paymentGatewayClosed");
        result.next({ ...orderDetails, stage: 'paymentGatewayClosed' });
      }
    );
    return result;
  }

  // Step 2 of Payment Flow
  createOrder(orderDetails: CreateOrder) {
    return this.https.post(
      environment.cloudFunctions.createOrder,
      orderDetails,
      this.httpOptions
    );
  }

  // Step 3 of Payment Flow
  async payWithRazorpay(order: any, booking: any, result: any) {
    const options = {
      key: environment.RAZORPAY_KEY_ID,
      amount: order.amount,
      image: 'https://shreeva.com/images/logo.png',
      order_id: order.id, //Order ID generated in Step 1
      currency: order.currency,
      name: 'Madhav Seva',
      prefill: {
        name: this.dataProvider.currentUser!.userData.name,
        contact: booking.user.phone,
      },
      theme: {
        color: '#ffc670',
      },
    };
    try {
      let data: any = await Checkout.open(options);
      let obj = {
        amount: options.amount,
        prefill: options.prefill,
      };
      let paymentDetail = {
        ...data.response,
        ...order,
        ...obj,
        stage: 'paymentCaptureSuccess',
      };
      result.next({ ...paymentDetail, stage: 'paymentCaptureSuccess' });
    } catch (error: any) {
      //it's paramount that you parse the data into a JSONObject
      result.next({ ...error, stage: 'paymentCaptureFailed' });
    }
  }

  createRefund(refundDetails: CreateRefund) {
    return this.https.post(
      environment.cloudFunctions.createRefund,
      refundDetails,
      this.httpOptions
    );
  }
  geteOrderById(orderId: string) {
    return this.https.get(environment.cloudFunctions.getOrderById + orderId);
  }
  getRefundDetailsById(payId: string, refundId: string) {
    return this.https.get(
      environment.cloudFunctions.getRefundDetails +
        '?payId=' +
        payId +
        '&refundId=' +
        refundId
    );
  }
}

export interface paymentDetail extends booking {
  cost: number;
}
export interface booking {
  user: {
    displayName?: string;
    email?: string;
    phone?: string;
  };
  grandTotal: number;
}

// handleSubscription(response: any,result:Subject<any>) {
//   this.https.post(
//     environment.cloudFunctions.verifySubscription,
//     response,
//     { responseType: 'json' }
//   ).subscribe((res: any) => {
//     if (res.verified == true){
//       result.next({...res,response,stage:"paymentCaptureSuccess"})
//     } else {
//       result.next({...res,response,stage:"paymentCaptureFailed"})
//     }
//   });
// }

// handleWallet(amount: number) {
//   this.WindowRef = window;
//   var result: Subject<any> = new Subject();
//   var ref = this;
//   function preparePaymentDetails(
//     order: any,
//     orderDetails: any,
//     result: Subject<any>
//   ) {
//     return {
//       key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
//       amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
//       name: 'Pay',
//       currency: order.currency,
//       order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
//       image: 'https://shreeva.com/images/logo.png',
//       handler: function (response: any) {
//         ref.finalizePayment(response, result);
//       },
//       prefill: {
//         name: ref.dataProvider?.currentUser?.userData?.name,
//         contact: '+91' + ref.dataProvider?.currentUser?.userData?.userMobile,
//       },
//       theme: {
//         color: '#ffc670',
//       },
//     };
//   }
//   let orderDetails: CreateOrder = {
//     amount: amount * 100,
//     receipt: this.generateRecipetNumber(),
//     currency: 'INR',
//     notes: {},
//   };
//   this.createOrder(orderDetails).subscribe(
//     (order) => {
//       let orderDetail = preparePaymentDetails(order, amount, result);
//       var rzp1 = new this.WindowRef.Razorpay(orderDetail);
//       this.orders.push(orderDetail);
//       rzp1.open();
//       result.next({ ...orderDetails, stage: 'paymentGatewayOpened' });
//     },
//     (error) => {
//       result.next({ ...orderDetails, stage: 'paymentGatewayError' });
//     },
//     () => {
//       // completed
//       result.next({ ...orderDetails, stage: 'paymentGatewayClosed' });
//     }
//   );
//   return result;
// }

// handleSubscriptionPayment(data: paymentDetail) {}

// finalizePayment(response: any, result: Subject<any>) {
//   this.https
//     .post(environment.cloudFunctions.capturePayment, {
//       amount: this.orders.find(
//         (order) => order.order_id == response.razorpay_order_id
//       ).amount,
//       currency: 'INR',
//       payment_id: response.razorpay_payment_id,
//     })
//     .subscribe({
//       next: (res: any) => {
//         if (res.status == 'captured') {
//           result.next({
//             ...res,
//             stage: 'paymentCaptureSuccess',
//             orderDetails: this.orderDetails,
//           });
//         } else {
//           result.next({ ...res, stage: 'paymentCaptureFailed' });
//         }
//       },
//       error: (error) => {
//         return;
//       },
//     });
// }

export interface checkoutData {
  authdata: any;
  merchantID: string;
  intentID: string;
}
