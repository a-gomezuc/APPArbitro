import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  player:any;
  jugadores:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService:UserServiceProvider, public storage:Storage) {
    this.obtenerJugadorDni();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

  obtenerJugador(){
    this.userService.getUser(this.navParams.get("nombre"), this.navParams.get("apellidos")).then( res => {
      this.player = res;
    },
    error =>{
      console.log(error);
    });
  }
  obtenerJugadorDni(){
    this.userService.getPlayerId(this.navParams.get("id")).then( res => {
      this.player = res;
      this.obtenerEquipoJugador(this.player.equipo);
    },
    error =>{
      console.log(error);
    });
  }
  obtenerEquipoJugador(id:String){
    this.userService.getEquipoByID(id).then(
      res=>{this.player.equipo=res},
      error=>{console.log(error);});
  }
  escribeUsuariosLocal() {
    this.storage.get("Jugadores").then((jugadores) => {
      this.jugadores = (JSON.parse(jugadores));
    });
  }
  sacaPorPantalla(){
    console.log(this.jugadores);
  }

  isSpanish(){
    if(this.player!==undefined)
      return this.player.nacionalidadEspañola;
      else return false;
    }
    isSancionado(jugador){
      if (jugador==undefined || jugador.fechaSancion==undefined || jugador.fechaSancion=="" || jugador.fechaSancion==null){
        return false
      }
      else{ 
        return true;
      }
    }
  cambiaNombre(){
    for (var jugador of this.jugadores){
      if (jugador.nombre == this.player.nombre){
        jugador.nombre = "Mariano";
        this.actualizaEnAPI(jugador.id,jugador);
      }
        this.storage.ready().then(() => {
          console.log("Memoria interna preparada");
        });
        this.storage.set("Jugadores", JSON.stringify(this.jugadores));
      }
    }
  actualizaEnAPI(id,jugador){
    this.userService.modifyPlayer(id,jugador);
  }
  }