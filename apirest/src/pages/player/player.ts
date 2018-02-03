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
    this.obtenerJugadorId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
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
    if (jugador == undefined || jugador.fechaSancion == undefined || jugador.fechaSancion == "" || jugador.fechaSancion == null) {
      return false
    }
    else {
      return true;
    }
  }
}