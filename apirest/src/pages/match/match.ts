import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Generated class for the MatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {

  partido: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserServiceProvider) {
    this.obtenerPartido();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }

  obtenerPartido(){
    this.userService.getMatchById(this.navParams.get("idPartido")).then(
      res=>this.partido=res,
      error=>console.log(error));
  }
}
