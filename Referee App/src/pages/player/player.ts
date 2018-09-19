import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
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
  imagenEquipo = "shield.png";
  jugadores: any;
  manejadorErrores = new ManejadorErroresComponent(this.alerta);


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public storage: Storage,
    public alerta: AlertController,
    public loadingCtrl: LoadingController,
    public backGroundMode : BackgroundMode) {
    this.imagenEquipo = "shield.png";
    this.obtenerDatos();
    this.backGroundMode.setDefaults({
      title:"Arbitrando..." ,
      text: "Referee App realizando tareas en segundo plano."
  });
    this.backGroundMode.enable();
  }

  ionViewDidLoad() {
  }

  //Obtiene los datos del jugador.
  obtenerDatos() {
    let loader = this.loadingCtrl.create({
      content: "Cargando jugador"
    });
    loader.present();
    this.player = this.navParams.get("jugador");
    this.player.equipo = this.navParams.get("nombreEquipo");
    this.imagenEquipo = this.navParams.get("imagenEquipo");
    loader.dismiss();
  }

  //Obtiene el jugador.
  obtenerJugadorId() {
    this.userService.getPlayerId(this.navParams.get("id")).then(res => {
      this.player = res;
      this.obtenerEquipoJugador(this.player.equipo);
    },
      error => {
        this.manejadorErrores.manejarError(error);
      });
  }

  //Obtiene los datos del equipo del jugador.
  obtenerEquipoJugador(id: String) {
    this.userService.getEquipoByID(id).then(
      res => { this.player.equipo = res },
      error => { this.manejadorErrores.manejarError(error); });
  }

  //Calcula los partidos de sanción del jugador.
  partidosSancion(jugador) {
    var partidosTotales = 0;
    for (var i = 0; i < jugador.sanciones.length; i++) {
      if (jugador.sanciones[i].enVigor) {
        partidosTotales = partidosTotales + jugador.sanciones[i].partidosRestantes;
      }
    }
    return partidosTotales;
  }

  //Devuelve si un jugador está sancionado.
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