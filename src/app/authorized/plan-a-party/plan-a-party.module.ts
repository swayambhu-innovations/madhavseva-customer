import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanAPartyPageRoutingModule } from './plan-a-party-routing.module';

import { PlanAPartyPage } from './plan-a-party.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanAPartyPageRoutingModule,
    WidgetsModule
  ],
  declarations: [PlanAPartyPage]
})
export class PlanAPartyPageModule { }
