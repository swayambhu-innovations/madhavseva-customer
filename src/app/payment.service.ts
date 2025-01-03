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
  orderDetails: any;
  orders: any[] = [];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow requests from all origins
      Accept: '*/*',
      'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    }),
  };
  get MainWindowRef() {
    return this.WindowRef;
  }

  // generateRecipetNumber(){
  //   return `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
  // }

  generateIdempotentKey() {
    return Math.random() * 5123 * 43 + 10;
  }

  generateInvoiceNumber() {
    return `INV${Date.now().toString()}`;
  }

  generateRecipetNumber() {
    return `JIO${Math.floor(Math.random() * 5123 * 43) + 10}`;
  }

  handleJMPPayment(loader: any) {
    this.WindowRef = window;
    var result: Subject<any> = new Subject();

    loader.present();
    //wfig
    loader.dismiss();
    return result;
  }

  authJMP() {
    const data = {
      application: {
        clientId: environment.jioPayConfig.clientId,
      },
      authenticateList: [
        {
          mode: 22,
          value: environment.jioPayConfig.clientSecret,
        },
      ],
      scope: 'SESSION',
      purpose: 2,
    };
    return this.https.post(
      environment.cloudFunctions.authJMP,
      data,
      this.httpOptions
    );
  }

  intentJMP(booking: any, authData: any) {
    booking.user.phone = booking.user.phone?.replace(/\D/g, '').slice(-10);
    const date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    const orderDetail = {
      transaction: {
        idempotentKey: this.generateIdempotentKey().toString(),
        invoice: this.generateInvoiceNumber(),
        initiatingEntityTimestamp: date.toISOString(),
        initiatingEntity: {
          callbackUrl:
            'https://apig.jiomoney.com/payments/jfs/v2/payments/status',
          returnUrl: 'https://checkout.jiopay.com/',
        },
      },
      amount: {
        // netAmount: 0.01,
        // grossAmount: 0.01,
        netAmount: Math.round(booking.grandTotal!),
        grossAmount: Math.round(booking.grandTotal!),
      },
      payer: {
        externalId: this.generateRecipetNumber(),
        name: booking.user?.displayName || 'Temp',
        email: booking.user?.email || 'temp@gmail.com',
        mobile: {
          number: booking.user.phone,
          countryCode: '91',
        },
        type: 11,
      },
      payee: {
        merchantId: environment.jioPayConfig.MID,
        name: 'ISCONPrayagraj',
        email: 'AutomationMerchant@gmail.com',
        mobile: {
          countryCode: '+91',
          number: '9790425436',
        },
        vpa: environment.jioPayConfig.VPA,
        type: 16,
      },
      checkout: {
        template: {
          id: '',
        },
        allowed: [
          {
            rank: '1',
            methodType: '110',
            methodSubType: '566',
          },
          {
            rank: '2',
            methodType: '212',
            methodSubType: '580',
          },
          {
            rank: '3',
            methodType: '110',
            methodSubType: '582',
            cardType: [110, 130, 131],
          },
          {
            rank: '4',
            methodType: '110',
            methodSubType: '579',
          },
          {
            rank: '5',
            methodType: '110',
            methodSubType: '581',
          },
          {
            rank: '6',
            methodType: '110',
            methodSubType: '620',
          },
        ],
      },
    };
    const data = {
      orderDetail: { ...orderDetail },
      accesToken: authData?.session?.accessToken?.tokenValue,
      appIdToken: authData?.session?.appIdentifierToken,
    };
    return this.https.post(
      environment.cloudFunctions.intentJMP,
      data,
      this.httpOptions
    );
  }

  statusJMP(txnId: string, accesToken: string, appIdToken: string) {
    const data = {
      payload: {
        transactionId: txnId,
      },
      accesToken: accesToken,
      appIdToken: appIdToken,
    };
    return this.https.post(
      environment.cloudFunctions.statusJMP,
      data,
      this.httpOptions
    );
  }

  createOrder(orderDetails: CreateOrder) {
    return this.https.post(
      environment.cloudFunctions.createOrder,
      orderDetails,
      this.httpOptions
    );
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

  async payWithRazorpay(order: any, booking: any, result: any) {
    const options = {
      key: environment.RAZORPAY_KEY_ID,
      amount: order.amount,
      image: 'https://shreeva.com/images/logo.png',
      order_id: order.id, //Order ID generated in Step 1
      currency: order.currency,
      name: 'MadhavSeva',
      prefill: {
        name: this.dataProvider.currentUser!.userData.name,
        contact: booking.user.phone,
      },
      theme: {
        color: '#2a1234',
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
