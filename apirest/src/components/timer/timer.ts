import { Component } from '@angular/core';

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
  public hora: number=0;
  public minuto: number=0;
  public segundos: number=0;
  public contador: any=undefined;

  start(){
    if (this.contador==undefined){
    this.contador=setInterval(()=>{
      this.segundos+=1;
      if(this.segundos==60){
        this.segundos=0;
        this.minuto+=1;
      }


    },1000)
  }
  }

  stop(){
    clearInterval(this.contador);
    this.hora = this.hora;
    this.minuto= this.minuto;
    this.segundos = this.segundos;
    this.contador=undefined;
  }

  reinicia(){
    clearInterval(this.contador);
    this.hora = 0;
    this.minuto= 0;
    this.segundos = 0;
    this.contador=undefined;
  }

  constructor() {
  }

}
