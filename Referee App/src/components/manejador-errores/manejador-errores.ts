import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ManejadorErroresComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'manejador-errores',
  templateUrl: 'manejador-errores.html'
})
export class ManejadorErroresComponent {

  constructor(
    public alerta: AlertController
  ) {
  }

  public manejarError(error: any) {
    switch (error.status) {
      case 406:
        this.alertaErrorNoAceptable();
      case 404:
        this.alertaErrorInesperado();
      default:
        this.alertaErrorInesperado();
    }
  }
  public alertaErrorInesperado() {
    let alertaError = this.alerta.create({
      title: 'ERROR',
      subTitle: 'Ha ocurrido un error inesperado.',
      buttons: ['Aceptar']
    });
    alertaError.present();
  }
  public alertaErrorNoAceptable() {
    let alertaError = this.alerta.create({
      title: 'ERROR',
      subTitle: 'No tiene permisos para realizar esa acción.',
      buttons: ['Aceptar']
    });
    alertaError.present();
  }
}

