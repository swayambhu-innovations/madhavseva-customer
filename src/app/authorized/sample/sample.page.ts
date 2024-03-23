import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { PaymentService } from 'src/app/payment.service';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.page.html',
  styleUrls: ['./sample.page.scss'],
})
export class SamplePage implements OnInit {
  constructor(
    private paymentService: PaymentService,
    public dataProvider: DataProviderService
  ) {}
  checkoutData: any;

  ngOnInit() {
    this.paymentService
      .authJM({
        grandTotal: 500,
        user: {
          phone: '+917518299883',
        },
      })
      .then(async (paymentResponse) => {
        this.checkoutData = paymentResponse;
      });
  }
}
