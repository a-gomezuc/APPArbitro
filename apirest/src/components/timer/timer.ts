import { Component } from '@angular/core';
import { Vibration } from '@ionic-native/vibration';
import { LocalNotifications } from '@ionic-native/local-notifications';


/**
 * Generated class for the TimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {
  public hora: number = 0;
  public minuto: number = 0;
  public segundos: number = 0;
  public contador: any = undefined;
  public activarVibrarTimer: Boolean;
  public minutoVibrarTimer: Number;
  public vibration : Vibration;
  public localNotifications : LocalNotifications;
  constructor( ) {
    this.vibration =  new Vibration();
    this.localNotifications = new LocalNotifications();
  }

  start() {
    if (this.contador == undefined) {
      this.contador = setInterval(() => {
        this.segundos += 1;
        if (this.segundos == 60) {
          this.segundos = 0;
          this.minuto += 1;
          if (this.activarVibrarTimer) {
            if (this.minuto == this.minutoVibrarTimer) {
              this.vibration.vibrate(3000);
              this.localNotifications.schedule({
                id: 1,
                title: "Referee App",
                text: 'Se ha alcanzado el tiempo fijado.',
                vibrate: true
              })
            }
          }
        }
      }, 1000)
    }
  }

  stop() {

    clearInterval(this.contador);
    this.hora = this.hora;
    this.minuto = this.minuto;
    this.segundos = this.segundos;
    this.contador = undefined;
  }

  reinicia() {
    clearInterval(this.contador);
    this.hora = 0;
    this.minuto = 0;
    this.segundos = 0;
    this.contador = undefined;
  }

  setActivarVibrar (valor: Boolean){
    this.activarVibrarTimer = valor;
    console.log("Cambio activar en crono:" + valor);
  }

  setMinutoVibrar(valor:Number){
    this.minutoVibrarTimer = valor;
    console.log("Cambio min crono: "+ valor);
  }

}
