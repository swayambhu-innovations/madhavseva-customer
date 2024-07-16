import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { PaymentService } from 'src/app/payment.service';
import { BookingService } from '../booking/booking.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { Timestamp, collection } from 'firebase/firestore';
import { Firestore, getDocs } from '@angular/fire/firestore';
import { error } from 'console';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-slot',
  templateUrl: './select-slot.page.html',
  styleUrls: ['./select-slot.page.scss'],
})
export class SelectSlotPage implements OnInit {
  name = 'Address & Time Slot';
  selectedDate: Date | undefined;

  selectedStartTime: Date | undefined;
  WindowRef: any;
  selectedEndTime: Date | undefined;
  selectAgentArrivalTime: Date | undefined;

  dates: Date[] = [];
  times: Date[] = [];
  slots: any[] = [];
  status: any;
  slotsArray: any[] = [];
  selectedTimeState: boolean = false;
  selectedSlot: any;
  startTime: any;
  endTime: any;
  url = 'https://pp-checkout.jiopay.com:8443';

  agentArrivalArray: Date[] = [];

  currentDateNTime = {
    todaydate: 0,
    currenttime: 0,
  };

  resData: any;
  slotsIcons = [
    {
      light: '../../../assets/icon/slots/morning1.svg',
      dark: '../../../assets/icon/slots/morning2.svg',
      disabled: '../../../assets/icon/slots/morning3.svg',
    },
    {
      light: '../../../assets/icon/slots/lateMorning1.svg',
      dark: '../../../assets/icon/slots/lateMorning2.svg',
      disabled: '../../../assets/icon/slots/lateMorning3.svg',
    },
    {
      light: '../../../assets/icon/slots/afternoon1.svg',
      dark: '../../../assets/icon/slots/afternoon2.svg',
      disabled: '../../../assets/icon/slots/afternoon3.svg',
    },
    {
      light: '../../../assets/icon/slots/lateafternoon1.svg',
      dark: '../../../assets/icon/slots/lateAfternoon2.svg',
      disabled: '../../../assets/icon/slots/lateafternoon3.svg',
    },
    {
      light: '../../../assets/icon/slots/evening1.svg',
      dark: '../../../assets/icon/slots/evening2.svg',
      disabled: '../../../assets/icon/slots/evening3.svg',
    },
    {
      light: '../../../assets/icon/slots/lateevening1.svg',
      dark: '../../../assets/icon/slots/lateevening2.svg',
      disabled: '../../../assets/icon/slots/lateEvening3.svg',
    },
    {
      light: '../../../assets/icon/slots/night1.svg',
      dark: '../../../assets/icon/slots/night2.svg',
      disabled: '../../../assets/icon/slots/night3.svg',
    },
  ];

  slotsStatus = [
    'Morning',
    'Late Morning',
    'Afternoon',
    'Late Afternoon',
    'Evening',
    'Late Evening',
    'Night',
  ];
  activeSlotCount: number = 0;
  orderDetails: any;
  authData: any;

  constructor(
    private firestore: Firestore,
    public dataProvider: DataProviderService,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private router: Router,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    // regenrate the slots
    // this.currentTime = (new Date()).getHours();
    this.generateSlots();
    this.totalSlots();
  }

  authJMP() {
    try {
      this.paymentService.authJMP().subscribe(async (authData) => {
        console.log(authData);
        if (authData['status'] === 'SUCCESS') {
          this.paymentService
            .intentJMP(
              {
                grandTotal:
                  this.dataProvider.currentBooking!.billing.grandTotal,
                user: {
                  phone: this.dataProvider.currentUser?.user.phoneNumber || '',
                },
              },
              authData
            )
            .subscribe((orderDetails) => {
              console.log(orderDetails);
              this.orderDetails = orderDetails;
            });
        } else console.log('error in pay');
      });
    } catch (error) {
      console.log(error);
    }
  }

  async ionViewDidEnter() {
    const isRetry = history.state.isRetry;
    if (!isRetry) {
      this.clearSlot();
    }
    this.authJMP();
    let booking = this.dataProvider.currentBooking;
    if (booking?.isUpdateSlot && booking.timeSlot) {
      //this.selectedDate = booking.timeSlot.date.toDate();
      this.selectedDate = undefined;
      //this.selectedStartTime = booking.timeSlot.time.startTime.toDate();
      this.selectedStartTime = undefined;
      //this.selectedEndTime = booking.timeSlot.time.endTime.toDate();
      this.selectedEndTime = undefined;
    }
  }
  generateSlots() {
    // fill dates with next 7 days starting from today
    let today = new Date();
    for (let i = 0; i < 5; i++) {
      let date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      this.dates.push(date);
    }

    // fill times with 8am to 8pm
    for (let i = 9; i <= 10; i++) {
      // let date = new Date(
      //   today.getFullYear(),
      //   today.getMonth(),
      //   today.getDate(),
      //   i
      // );
      // this.times.push(date);
      let t1 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        i
      );
      this.times.push(t1);
      let t2 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        i,
        30
      );
      this.times.push(t2);
    }
    this.selectedDate = this.dates[0];
    this.currentDateNTime.todaydate = new Date().getDate();
    this.currentDateNTime.currenttime = new Date().getHours();
  }

  totalSlots() {
    getDocs(collection(this.firestore, 'slots')).then((slots) => {
      this.slots = slots.docs.map((slot) => {
        return { ...slot.data(), id: slot.id };
      });
      this.slotsArray = this.slots.sort((a: any, b: any) =>
        a.index > b.index ? 1 : -1
      );
      this.getActiveSlotsCount();
    });
  }

  clearSlot() {
    this.startTime = 0;
    this.selectAgentArrivalTime = new Date();
    this.agentArrivalArray = [];
    this.selectedTimeState = false;
  }

  setSlot(slot: any) {
    let today = new Date();

    this.selectedTimeState = false;

    this.selectedStartTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.startTime
    );
    this.selectedEndTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.endTime
    );
    this.selectedSlot = slot;
    this.preferredAgentTime(this.startTime, this.endTime);
    this.getActiveSlotsCount();
  }

  getApplicableSlots(items: any) {
    const totalJobTime =
      +this.dataProvider.currentBooking!.billing.totalJobTime;
    const index = this.slotsArray.findIndex((item) => item.id == items.id);

    const slotsTime = +items.end - +items.start;
    const calcul = slotsTime * (this.slotsArray.length - index) - totalJobTime;
    const numStart = +items.start;
    if (this.currentDateNTime.todaydate == this.selectedDate?.getDate()) {
      return !(this.currentDateNTime.currenttime < numStart && calcul >= 0);
    } else {
      return !(calcul >= 0);
    }
  }

  getActiveSlotsCount() {
    let slotsCount = 0;
    if (this.slotsArray.length > 0) {
      this.slotsArray.map((item) => {
        if (!this.getApplicableSlots(item)) {
          slotsCount++;
        }
      });
      this.activeSlotCount = slotsCount;
    }
  }

  onSelectDate(btn: Date | undefined) {
    this.selectedDate = btn;
    this.clearSlot();
    this.getActiveSlotsCount();
  }

  get totalTimeNeeded() {
    let mins = 0;
    this.dataProvider.currentBooking?.services.forEach((service) => {
      service.variants.forEach((variant) => {
        if (variant.actualJobDuration) {
          mins += variant.actualJobDuration * variant.quantity;
        }
      });
    });

    let duration = mins + ' Mins';
    return duration;
  }

  preferredAgentTime(start: any, end: any) {
    this.agentArrivalArray = [];
    let today1 = new Date();
    const startTime = +start;
    const endTime = +end;

    for (let i = startTime; i < endTime; i++) {
      let t1 = new Date(
        today1.getFullYear(),
        today1.getMonth(),
        today1.getDate(),
        i
      );
      this.agentArrivalArray.push(t1);
      let t2 = new Date(
        today1.getFullYear(),
        today1.getMonth(),
        today1.getDate(),
        i,
        30
      );
      this.agentArrivalArray.push(t2);
    }
  }

  async setTimeSlot() {
    const selectedSlotDate = new Date(this.selectedDate || '');
    this.selectedStartTime = new Date(
      selectedSlotDate.getFullYear(),
      selectedSlotDate.getMonth(),
      selectedSlotDate.getDate(),
      this.selectedSlot['start']
    );

    this.selectedEndTime = new Date(
      selectedSlotDate.getFullYear(),
      selectedSlotDate.getMonth(),
      selectedSlotDate.getDate(),
      this.selectedSlot['end']
    );
    this.dataProvider.currentBooking!.timeSlot = {
      date: Timestamp.fromDate(this.selectedDate!),
      agentArrivalTime: Timestamp.fromDate(this.selectedEndTime!),
      time: {
        startTime: Timestamp.fromDate(this.selectedStartTime!),
        endTime: Timestamp.fromDate(this.selectedEndTime!),
      },
      id: this.selectedSlot.id,
    };
    this.selectedTimeState = true;
  }
  async createBookingWithoutPay() {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    if (
      this.dataProvider.currentBooking &&
      this.dataProvider.currentBooking.timeSlot
    ) {
      this.dataProvider.currentBooking.timeSlot.agentArrivalTime =
        Timestamp.fromDate(this.selectAgentArrivalTime!);
    }
    let booking = this.dataProvider.currentBooking;
    if (booking && !booking?.isUpdateSlot) {
      booking.isPaid = false;
      booking.isPaylater = true;
      booking.createdAt = Timestamp.fromDate(new Date());
      this.bookingService
        .addBooking(
          this.dataProvider.currentBooking!,
          this.dataProvider.currentUser!.user!.uid
        )
        .then(async () => {
          await this.cartService.deleteBooking(
            this.dataProvider.currentUser!.user.uid,
            this.dataProvider.currentBooking!.id!
          );
          await this.cartService.updateCart();
          this.router.navigate(['/authorized/order-placed']);
        })
        .catch((error) => {
          console.log('errror............: ', error);
          loader.dismiss();
        })
        .finally(() => {
          loader.dismiss();
        });
    } else {
      this.bookingService
        .updateBookingSlot(
          this.dataProvider.currentUser!.user.uid,
          this.dataProvider.currentBooking!.id!,
          this.dataProvider.currentBooking
        )
        .then((resp) => {
          this.router.navigate(['/authorized/order-placed']);
          loader.dismiss();
        });
    }
  }

  async createBooking() {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    let scope = this;
    this.WindowRef = window;
    if (
      this.dataProvider.currentBooking &&
      this.dataProvider.currentBooking.timeSlot
    ) {
      this.dataProvider.currentBooking.timeSlot.agentArrivalTime =
        Timestamp.fromDate(this.selectAgentArrivalTime!);
    }
    let booking = this.dataProvider.currentBooking;
    loader.present();
    if (!booking?.isUpdateSlot) {
      let options = {
        appaccesstoken:
          this.orderDetails.transaction.metadata['x-app-access-token'],
        appidtoken: this.orderDetails.transaction.metadata['x-appid-token'],
        intentid: this.orderDetails.transaction.intentId,
        merchantid: environment.jioPayConfig.MID,
        theme: {
          brandColor: '#F28322',
          bodyBgColor: '#fff',
          bodyTextColor: '#A65814',
          headingText: '#ffffff',
        },
        paymentHandler: function (
          txnId: any,
          intentid: string,
          status: string,
          message: string
        ) {
          scope.paymentService
            .statusJMP(
              txnId,
              scope.orderDetails.transaction.metadata['x-app-access-token'],
              scope.orderDetails.transaction.metadata['x-appid-token']
            )
            .subscribe(async (resData) => {
              scope.status = resData[0];
            });
          if (
            booking &&
            !booking?.isUpdateSlot &&
            status &&
            status === 'completed'
          ) {
            booking.createdAt = Timestamp.fromDate(new Date());
            scope.bookingService
              .addBooking(
                scope.dataProvider.currentBooking!,
                scope.dataProvider.currentUser!.user!.uid
              )
              .then(async () => {
                await scope.cartService.deleteBooking(
                  scope.dataProvider.currentUser!.user.uid,
                  scope.dataProvider.currentBooking!.id!
                );
                await scope.cartService.updateCart();
                scope.dataProvider.currentBooking!.payment = 'success';
                scope.dataProvider.currentBooking!.isPaid = true;

                scope.orderDetails = {} as any;
                scope.router.navigate(['/authorized/order-placed']);
              })
              .finally(() => {
                loader.dismiss();
              });
          } else {
            scope.bookingService
              .updateBookingSlot(
                scope.dataProvider.currentUser!.user.uid,
                scope.dataProvider.currentBooking!.id!,
                scope.dataProvider.currentBooking
              )
              .then((resp) => {
                scope.orderDetails = {} as any;
                scope.router.navigate(['/authorized/order-placed']);
                loader.dismiss();
              });
          }
        },
      };
      this.WindowRef.JioPay(options);
    }

    loader.dismiss();
  }

  async rescheduleBooking() {
    let loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    loader.present();
    this.bookingService
      .updateBookingSlot(
        this.dataProvider.currentUser!.user.uid,
        this.dataProvider.currentBooking!.id!,
        this.dataProvider.currentBooking
      )
      .then((resp) => {
        this.router.navigate(['/authorized/order-placed']);
        loader.dismiss();
      });
  }
}
