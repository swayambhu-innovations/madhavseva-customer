import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-plan-a-party',
  templateUrl: './plan-a-party.page.html',
  styleUrls: ['./plan-a-party.page.scss'],
})
export class PlanAPartyPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  home(){
      this.router.navigate(['/authorized/home']);
  }

}
