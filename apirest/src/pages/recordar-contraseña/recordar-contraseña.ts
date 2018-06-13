import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { InicioPage } from '../inicio/inicio'
/**
 * Generated class for the RecordarContraseñaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recordar-contraseña',
  templateUrl: 'recordar-contraseña.html',
})
export class RecordarContraseñaPage {
  private email : String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertaController:AlertController, public userService:UserServiceProvider, public menu: MenuController) {
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordarContraseñaPage');
  }

  recordarContrasenia(){
    this.userService.sendNewPassword(this.email).then(
      res=>{this.alertaAvisoOk();
        this.navCtrl.setRoot(InicioPage)},
      err=>this.alertaAvisoError()
    )
  }

  alertaAvisoOk() {
    let alertaAviso = this.alertaController.create({
      title: 'Email enviado',
      subTitle: 'Se ha enviado su nueva contraseña al email introducido.',
      buttons: ['Aceptar']
    });
    alertaAviso.present();
  }
  alertaAvisoError() {
    let alertaAviso = this.alertaController.create({
      title: 'Error',
      subTitle: 'No se encuentran usuarios para el email introducido.',
      buttons: ['Aceptar']
    });
    alertaAviso.present();
  }
}
