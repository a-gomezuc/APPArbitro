import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


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
    public alerta: AlertController,
    public loadingCtrl: LoadingController) {
    this.obtenerDatos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

  obtenerDatos() {
    let loader = this.loadingCtrl.create({
      content: "Cargando jugador"
    });
    loader.present();
    this.player = this.navParams.get("jugador");
    this.player.equipo = this.navParams.get("nombreEquipo");
    loader.dismiss();
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

  partidosSancion(jugador) {
    var partidosTotales = 0;
    for (var i = 0; i < jugador.sanciones.length; i++) {
      if (jugador.sanciones[i].enVigor) {
        partidosTotales = partidosTotales + jugador.sanciones[i].partidosRestantes;
      }
    }
    return partidosTotales;
  }

  isSancionado(jugador) {
    var sancionado = false;
      if (jugador.sanciones.length > 0) {
        for (var i = 0; i < jugador.sanciones.length; i++) {
          if (jugador.sanciones[i].enVigor == true) {
            sancionado = true;
          }
        }
      }
    return sancionado;
  }
}