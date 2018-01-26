import { Component } from '@angular/core';
import { IonicPage, MenuController, AlertController,NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { InicioPage } from '../inicio/inicio';

/**
 * Generated class for the CerrarSesionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cerrar-sesion',
  templateUrl: 'cerrar-sesion.html',
})
export class CerrarSesionPage {

    inicioPage=InicioPage;
  constructor(public navCtrl: NavController, public alerta: AlertController, public navParams: NavParams,public menu: MenuController,public userService: UserServiceProvider) {
    this.menu.enable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CerrarSesionPage');
  }

  cerrarSesion(){
    this.userService.logout().then(
      res => 
        console.log(res),
      error => console.log(error));
    this.navCtrl.setRoot(this.inicioPage);
  }
  alertaCerrarSesion(nombre: String, apellidos: String) {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });
    confirm.present();
  }

}
