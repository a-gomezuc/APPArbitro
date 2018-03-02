import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';
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
  player: any;
  jugadores: any;
  manejadorErrores = new ManejadorErroresComponent(this.alerta);


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public storage: Storage,
    public alerta: AlertController) {
    this.obtenerDatos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

  obtenerDatos(){
    this.player = this.navParams.get("jugador");
    this.player.equipo = this.navParams.get("nombreEquipo");
  }
  obtenerJugadorId() {
    this.userService.getPlayerId(this.navParams.get("id")).then(res => {
      this.player = res;
      this.obtenerEquipoJugador(this.player.equipo);
    },
      error => {
        this.manejadorErrores.manejarError(error);
      });
  }
  obtenerEquipoJugador(id: String) {
    this.userService.getEquipoByID(id).then(
      res => { this.player.equipo = res },
      error => { this.manejadorErrores.manejarError(error); });
  }

  isSancionado(jugador) {
    if (jugador==undefined || jugador.sanciones == undefined || jugador.sanciones.length <= 0 || jugador.sanciones == null) {
      return false;
    }
    else {
      if (jugador.sanciones.length > 0) {
        if (jugador.sanciones[0].enVigor == false) {
          return false
        }
        else {
          return true;
        }
      }
      return false;
    }
  }
}