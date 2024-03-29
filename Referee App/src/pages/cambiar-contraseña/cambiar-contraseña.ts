import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { InicioPage } from '../inicio/inicio'
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CambiarContraseñaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cambiar-contraseña',
  templateUrl: 'cambiar-contraseña.html',
})
export class CambiarContraseñaPage {
  private nuevaContrasenia;
  private nuevaContraseniaRepetida;
  private arbitro;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public alertaController: AlertController, public userService: UserServiceProvider, public manejadorErrores: ManejadorErroresComponent, public storage: Storage) {
  }

  ionViewDidLoad() {
  }
  //Devuelve si ambas contraseñas coinciden.
  comprobarContrasenias() {
    if ((this.nuevaContrasenia == undefined) || (this.nuevaContraseniaRepetida == undefined)) {
      return false;
    }
    else {
      return (this.nuevaContrasenia == this.nuevaContraseniaRepetida)
    }
  }

  //Realiza el cambio de contraseña
  cambiaContrasenia() {
    if (this.comprobarContrasenias()) {
      let loader = this.loadingCtrl.create({
        content: "Cambiando contraseña..."
      });
      loader.present();
      this.storage.get('UsuarioConectado').then(
        res => {
        this.arbitro = JSON.parse(res);
          this.arbitro.clave = this.nuevaContrasenia;
          this.userService.modifyReferee(this.arbitro.id, this.arbitro).then(
            res => {
              loader.dismiss();
              this.alertaAvisoCoinciden();
              this.cerrarSesion();
            },
            err => {
              loader.dismiss();
              this.manejadorErrores.manejarError(err);
            }
          );
        },
        err => { 
          loader.dismiss();
          this.manejadorErrores.manejarError(err) }
      );
    }
    else {
      this.alertaAvisoNoCoinciden();
    }
  }

  //Indica mediante una alerta que las contraseñas no coinciden.
  alertaAvisoNoCoinciden() {
    let alertaAviso = this.alertaController.create({
      title: 'Error',
      subTitle: 'Las contraseñas no coinciden',
      buttons: ['Aceptar']
    });
    alertaAviso.present();
  }

  //Indice mediante una alerta que las contraseñas han cambiado correctamente.
  alertaAvisoCoinciden() {
    let alertaAviso = this.alertaController.create({
      title: 'Cambio realizado',
      subTitle: 'Su contraseña se ha actualizado',
      buttons: ['Aceptar']
    });
    alertaAviso.present();
  }

  cerrarSesion() {
    this.userService.logout().then(
      res => {
          this.navCtrl.setRoot(InicioPage);
      },
      error => this.manejadorErrores.manejarError(error));
  }

}
