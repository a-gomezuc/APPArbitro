import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { InicioPage } from '../inicio/inicio'
/**
 * Generated class for the RecordarContraseñaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recordar-contraseña',
  templateUrl: 'recordar-contraseña.html',
})
export class RecordarContraseñaPage {
  private email : String;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public alertaController:AlertController, public userService:UserServiceProvider, public menu: MenuController) {
    this.menu.enable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordarContraseñaPage');
  }

  recordarContrasenia(){    
    let loader = this.loadingCtrl.create({
      content: "Enviando nueva contraseña..."
    });
  loader.present();
    this.userService.sendNewPassword(this.email).then(
      res=>{this.alertaAvisoOk();
        this.navCtrl.setRoot(InicioPage);
        console.log(res);
      loader.dismiss()},
      err=>{loader.dismiss();
        this.alertaAvisoError()
        console.log(err);
      }
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
