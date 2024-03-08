import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

// import {Share} from '@capacitor/share';

@Component({
  selector: 'app-refer-afriend',
  templateUrl: './refer-afriend.page.html',
  styleUrls: ['./refer-afriend.page.scss'],
})
export class ReferAfriendPage implements OnInit {

  constructor(
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
  }

  shareLink(){
    this.socialSharing.share('Please try out Kitty Connect app for all types of house maintenance services.', 'Subject', undefined, 'https://play.google.com/store/apps/details?id=com.shreeva.kittyconnect')
    .then(() => {
      
    })
    .catch((error) => {
      console.error('Error sharing:', error);
    });
  }

  

}
