import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Checkout } from 'capacitor-razorpay';
import { NumberFormatStyle } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private https:HttpClient,private alertify:AlertsAndNotificationsService,
    private loadingController: LoadingController, private dataProvider:DataProviderService) { }
  WindowRef: any;
  orders: any[] = [];
   httpOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      'Accept':"*/*",
      'Content-Type':  'application/json'
    })
  };
  get MainWindowRef() {
    return this.WindowRef;
  }

  generateRecipetNumber(){
    return `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
  }
  
  handleWallet(amount:number){
   
    this.WindowRef = window;
    var result:Subject<any> = new Subject();
      var ref = this;
      function preparePaymentDetails(order: any, orderDetails: any,result:Subject<any>) {
        return {
          key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
          name: 'Pay',
          currency: order.currency,
          order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
          image: 'https://shreeva.com/images/logo.png',
          handler: function (response: any) {
            ref.finalizePayment(response,result);
          },
          prefill: {
            name: ref.dataProvider?.currentUser?.userData?.name,
            contact: '+91' +ref.dataProvider?.currentUser?.userData?.userMobile,
          },
          theme: {
            color: '#ffc670',
          },
        };
      }
      let orderDetails:CreateOrder = {
        amount: amount * 100,
        receipt: this.generateRecipetNumber(),
        currency:"INR",
        notes:{

        }
      };
      this.createOrder(orderDetails).subscribe((order) => {
          let orderDetail = preparePaymentDetails(order, amount,result)
          var rzp1 = new this.WindowRef.Razorpay(orderDetail);
          this.orders.push(orderDetail);
          rzp1.open();
          result.next({...orderDetails,stage:"paymentGatewayOpened"})
        },
        (error) => {
          result.next({...orderDetails,stage:"paymentGatewayError"})
        },
        ()=>{
          // completed
          result.next({...orderDetails,stage:"paymentGatewayClosed"})
        }
      )
      return result
  }
  orderDetails:any;
  handlePayment(data:booking){
    this.WindowRef = window;
    var result:Subject<any> = new Subject();
      var ref = this;
      function preparePaymentDetails(order: any, orderDetails: booking,result:Subject<any>) {
        return {
          key: environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
          name: 'Pay',
          currency: order.currency,
         // order_id: order.id, //This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
          image: 'https://shreeva.com/images/logo.png',
          handler: function (response: any) {
            ref.finalizePayment(response,result);
          },
          modal: {
            ondismiss: function(){
                result.next({...orderDetails,...order,stage:"paymentGatewayClosed"})
            }
        },
          prefill: {
            name: orderDetails.user.displayName,
            contact: orderDetails.user.phone,
          },
          theme: {
            color: '#2a1234',
          },
        };
      }
      let orderDetails:CreateOrder = {
        amount: Math.round(data.grandTotal! * 100),
        receipt: this.generateRecipetNumber(),
        currency: "INR",
        notes: {
        }
      };
      this.createOrder(orderDetails).subscribe((order:any) => {
         this.payWithRazorpay(order, data,result);
        
        },
        (error) => {
           //console.log(JSON.stringify(error.message), "error");
          result.next({...orderDetails,stage:"paymentGatewayError"});
        },
        ()=>{
          // completed
         // console.log("error............... paymentGatewayClosed");
          result.next({...orderDetails,stage:"paymentGatewayClosed"});
        }
      )
      return result
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

  finalizePayment(response: any,result:Subject<any>) {
    this.https.post(
      environment.cloudFunctions.capturePayment,{
      amount: this.orders.find((order) => order.order_id == response.razorpay_order_id).amount,
      currency: "INR",
      payment_id: response.razorpay_payment_id,
    }).subscribe({
      next:(res: any) => {
      if (res.status == "captured") {
        result.next({...res,stage:"paymentCaptureSuccess","orderDetails": this.orderDetails});
      } else {
        result.next({...res,stage:"paymentCaptureFailed"})
      }
    },
    error:(error)=>{
      return;
    }
  });
  }

  handleSubscriptionPayment(data:paymentDetail){

  }

  createOrder(orderDetails: CreateOrder) {
    return this.https.post(environment.cloudFunctions.createOrder ,orderDetails,this.httpOptions);
  }
  createRefund(refundDetails: CreateRefund) {
    return this.https.post(environment.cloudFunctions.createRefund ,refundDetails,this.httpOptions);
  }
  geteOrderById(orderId: string) {
    return this.https.get(environment.cloudFunctions.getOrderById +orderId);
  }
  getRefundDetailsById(payId: string,refundId:string) {
    return this.https.get(environment.cloudFunctions.getRefundDetails +"?payId=" +payId+'&refundId='+refundId);
  }

  async payWithRazorpay(order:any,booking:any,result:any){
    const options = {
      key:  environment.RAZORPAY_KEY_ID,
      amount: order.amount,
      image: 'https://shreeva.com/images/logo.png',
      order_id: order.id,//Order ID generated in Step 1
      currency:  order.currency,
      name: 'Kitty Connect',
      prefill: {
        name: this.dataProvider.currentUser!.userData.name,
        contact: booking.user.phone,
      },
      theme: {
        color: '#2a1234'
      }
    }
    try {
      let data:any = (await Checkout.open(options));
      let obj = {
        amount: options.amount,
        prefill:options.prefill
      }
      let paymentDetail = {...data.response,...order,...obj,stage:"paymentCaptureSuccess"}
      result.next({...paymentDetail,stage:"paymentCaptureSuccess"})
    } catch (error:any) {
      //it's paramount that you parse the data into a JSONObject
      result.next({...error,stage:"paymentCaptureFailed"})
    }
  }
}

import { AlertsAndNotificationsService } from './alerts-and-notifications.service';
import { DataProviderService } from './core/data-provider.service';
import { CreateOrder, CreateRefund } from './authorized/models/payment.structure';
import { LoadingController } from '@ionic/angular';

export interface paymentDetail extends booking {
    cost: number;
}
export interface booking {
  user:{
    displayName?:string,
    email?:string,
    phone?:string,
  },
  grandTotal:number,
}
