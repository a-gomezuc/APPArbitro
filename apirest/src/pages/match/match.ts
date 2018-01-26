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
  convocadosPartidoLocal: any[];
  convocadosPartidoVisitante: any[];
  arbitrando: Boolean;
  incidenciasPartido: any[];
  jugadoresConTarjetaAmarilla: any[];
  jugadoresConTarjetaRoja: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public menu: MenuController,
    public storage: Storage, public googleMaps: GoogleMaps) {
    this.obtenerPartido();
    this.convocadosPartidoLocal = [];
    this.convocadosPartidoVisitante = [];
    this.arbitrando = false;
    this.incidenciasPartido = [];
    this.jugadoresConTarjetaAmarilla = [];
    this.jugadoresConTarjetaRoja = [];
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
      res => {
        this.partido = res;
        console.log(res);
      },
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

  //Añade al array de convocadosPartidoLocal un jugador.
  convocarLocal(jugador) {
    // Comprueba si no existe ya
    if (this.convocadosPartidoLocal.indexOf(jugador) == -1) {
      this.convocadosPartidoLocal.push(jugador);
      this.alertaConvocado(jugador.nombre, jugador.apellidos);
    }
  }
  //Añade al array de convocadosPartidoVisitante un jugador.
  convocarVisitante(jugador) {
    // Comprueba si no existe ya
    if (this.convocadosPartidoVisitante.indexOf(jugador) == -1) {
      this.convocadosPartidoVisitante.push(jugador);
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
    setTimeout(() => alertaConvocado.dismiss(), 2000);
  }
  //Muestra un aviso al desconvocar a un jugador.
  alertaDesconvocado(nombre: String, apellidos: String) {
    let alertaDesconvocado = this.alerta.create({
      title: 'Desconvocado',
      subTitle: 'El jugador ' + nombre + ' ' + apellidos + ' ha sido desconvocado, no disputará el partido.',
    });
    alertaDesconvocado.present()
    setTimeout(() => alertaDesconvocado.dismiss(), 2000);
  }

  //Elimina a un jugador del array de convocados.
  desconvocarLocal(jugador) {
    let posicion = this.convocadosPartidoLocal.indexOf(jugador)
    if (posicion > -1) {
      this.convocadosPartidoLocal.splice(posicion, 1);
      this.alertaDesconvocado(jugador.nombre, jugador.apellidos);
    }
  }
  //Elimina a un jugador del array de convocados.
  desconvocarVisitante(jugador) {
    let posicion = this.convocadosPartidoVisitante.indexOf(jugador)
    if (posicion > -1) {
      this.convocadosPartidoVisitante.splice(posicion, 1);
      this.alertaDesconvocado(jugador.nombre, jugador.apellidos);
    }
  }

  //Método que activa el arbitraje en el partido.
  arbitrar() {
    this.arbitrando = true;
  }
  //Método que da paso al arbitraje de un partido.
  alertaArbitrar() {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: 'Una vez pulse sí no podrá realizar cambios. Compruebe los jugadores convocados.\n Ha convocado ' + this.convocadosPartidoLocal.length + ' jugadores locales y ' + this.convocadosPartidoVisitante.length + ' jugadores visitantes.',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.arbitrar();
          }
        }
      ]
    });
    confirm.present();
  }

  //Método que cambia a la página de jugador.
  cambiaAPlayerPage(id: String) {
    this.navCtrl.push(this.playerPage, { id });
  }
  //Método que comienza la cuenta del croonómetro
  comienzaCuenta() {
    this.timer.start();
  }

  //Método que devuelve si un jugador no está convocado
  isNotConvocado(jugador) {
    if (jugador == undefined) {
      return true;
    }
    else {
      return ((this.convocadosPartidoLocal.indexOf(jugador) == -1) && (this.convocadosPartidoVisitante.indexOf(jugador) == -1));
    }
  }

  //Método que añade un gol al equipo local
  nuevoGolLocal(idJugador, idPartido, minuto) {
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = idJugador;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    this.partido.golesLocal = this.partido.golesLocal + 1;
    console.log(this.incidenciasPartido);
  }
  //Método que añade un gol al equipo visitante
  nuevoGolVisitante(idJugador, idPartido, minuto) {
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = idJugador;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    this.partido.golesVisitante = this.partido.golesVisitante + 1;
    console.log(this.incidenciasPartido);
  }
  //Muestra una tarjeta amarilla al jugador, si ya tiene una, le muestra una amarilla y una roja. Añade todo a incidencias.
  mostrarTarjetaAmarilla(jugador, idPartido, minuto) {
    let posicion = this.jugadoresConTarjetaAmarilla.indexOf(jugador)
    var incidencia: any = {};
    if (posicion <= -1) {
      this.jugadoresConTarjetaAmarilla.push(jugador);
      incidencia.id = null;
      incidencia.tipo = "AMARILLA";
      incidencia.idJugador = jugador.id;
      incidencia.idPartido = idPartido;
      incidencia.minuto = minuto;
      incidencia.observaciones = "";
      this.incidenciasPartido.push(incidencia);
      console.log(this.jugadoresConTarjetaAmarilla);
      console.log(this.incidenciasPartido);
    }
    if (posicion > -1) {
      incidencia.id = null;
      incidencia.tipo = "AMARILLA";
      incidencia.idJugador = jugador.id;
      incidencia.idPartido = idPartido;
      incidencia.minuto = minuto;
      incidencia.observaciones = "Segunda tarjeta amarilla";
      this.incidenciasPartido.push(incidencia);
      this.mostrarTarjetaRoja(jugador, idPartido, minuto);
    }
  }
  //Muestra una tarjeta roja al jugador.
  mostrarTarjetaRoja(jugador, idPartido, minuto) {
    this.jugadoresConTarjetaRoja.push(jugador);
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "ROJA";
    incidencia.idJugador = jugador.id;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    console.log(this.jugadoresConTarjetaAmarilla);
    console.log(this.incidenciasPartido);
  }

  //Devuelve si un jugador tiene tarjeta amarilla.
  tieneTarjetaAmarilla(jugador) {
    if (jugador == undefined) {
      return false;
    }
    else {
      let posicion = this.jugadoresConTarjetaAmarilla.indexOf(jugador)
      if (posicion <= -1) {
        return false
      }
      else {
        return true;
      }
    }
  }
  //Devuelve si un jugador tiene tarjeta roja.
  tieneTarjetaRoja(jugador) {
    if (jugador == undefined) {
      return false;
    }
    else {
      let posicion = this.jugadoresConTarjetaRoja.indexOf(jugador)
      if (posicion <= -1) {
        return false
      }
      else {
        return true;
      }
    }
  }

}
