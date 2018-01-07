import { Component } from '@angular/core';
import { AlertController, MenuController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { GoogleMaps, GoogleMapOptions } from '@ionic-native/google-maps';
import { PlayerPage } from '../player/player'
import { TimerComponent } from '../../components/timer/timer'
import { Storage } from '@ionic/storage';



/**
 * Generated class for the MatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {

  timer = new TimerComponent();
  playerPage = PlayerPage;
  partido: any;
  map: any;
  convocados: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public menu: MenuController,
    public storage: Storage, public googleMaps: GoogleMaps) {
    this.obtenerPartido();
    this.convocados = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
    this.loadMap();
  }
  //Carga el mapa del estadio.
  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
  }

  //Obtiene el partido
  obtenerPartido() {
    this.userService.getMatchById(this.navParams.get("idPartido")).then(
      res => {this.partido = res;
        console.log(res);},
      error => console.log(error));
  }
  //Para conocer si un jugador está sancionado.
  isSancionado(jugador) {
    if (jugador.fechaSancion == undefined || jugador.fechaSancion == "" || jugador.fechaSancion == null) {
      return false
    }
    else {
      return true;
    }
  }

  //Añade al array de convocados a un jugador.
  convocar(jugador) {
    // Comprueba si no existe ya
    if (this.convocados.indexOf(jugador) == -1) {
      this.convocados.push(jugador);
      this.alertaConvocado(jugador.nombre, jugador.apellidos);
    }
  }

  //Muestra un aviso al convocar a un jugador.
  alertaConvocado(nombre: String, apellidos: String) {
    let alertaConvocado = this.alerta.create({
      title: 'Convocado',
      subTitle: 'El jugador ' + nombre + ' ' + apellidos + ' ha sido convocado para disputar el partido.',
    });
    alertaConvocado.present();
    setTimeout(() => alertaConvocado.dismiss(), 3000);
  }
  //Muestra un aviso al desconvocar a un jugador.
  alertaDesconvocado(nombre: String, apellidos: String) {
    let alertaDesconvocado = this.alerta.create({
      title: 'Desconvocado',
      subTitle: 'El jugador ' + nombre + ' ' + apellidos + ' ha sido desconvocado, no disputará el partido.',
    });
    alertaDesconvocado.present()
    setTimeout(() => alertaDesconvocado.dismiss(), 3000);
  }

  //Elimina a un jugador del array de convocados.
  desconvocar(jugador) {
    let posicion = this.convocados.indexOf(jugador)
    if (posicion > -1) {
      this.convocados.splice(posicion, 1);
      this.alertaDesconvocado(jugador.nombre, jugador.apellidos);
    }
  }
  cambiaAPlayerPage(id: String) {
    this.navCtrl.push(this.playerPage, {id});
  }
  comienzaCuenta() {
    this.timer.start();
  }
  isNotConvocado(jugador) {
    if (jugador == undefined) {
      return true;
    }
    else {
      return (this.convocados.indexOf(jugador) == -1);
    }
  }
}
