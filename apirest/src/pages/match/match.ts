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
  arbitro: any;
  map: any;
  convocadosPartidoLocal: any[];
  convocadosPartidoVisitante: any[];
  arbitrando: Boolean;
  rellenaActa: Boolean;
  incidenciasPartido: any[];
  jugadoresConTarjetaAmarilla: any[];
  jugadoresConTarjetaRoja: any[];
  observaciones: String;
  acta: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public menu: MenuController,
    public storage: Storage, public googleMaps: GoogleMaps) {
    this.obtenerPartidoyArbitro();
    this.convocadosPartidoLocal = [];
    this.convocadosPartidoVisitante = [];
    this.arbitrando = false;
    this.rellenaActa = false;
    this.incidenciasPartido = [];
    this.jugadoresConTarjetaAmarilla = [];
    this.jugadoresConTarjetaRoja = [];
    this.observaciones = '';
    this.acta = {};
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
  obtenerPartidoyArbitro() {
    this.userService.getMatchById(this.navParams.get("idPartido")).then(
      res => {
        this.partido = res;
        this.obtenerArbitro();
        console.log(res);
        this.partido.equipoLocal.plantillaEquipo.sort(this.compararPorDorsal);
        this.partido.equipoVisitante.plantillaEquipo.sort(this.compararPorDorsal);
        console.log(res);
      },
      error => console.log(error));
  }

  obtenerArbitro() {
    this.userService.getArbitroById(this.partido.idArbitro).then(
      res => {this.arbitro = res,
        console.log(this.arbitro)},
      err => console.log(err)
    );
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
      this.convocadosPartidoLocal.sort(this.compararPorDorsal);
      this.alertaConvocado(jugador.nombre, jugador.apellidos, jugador.dorsal);
    }
  }
  //Añade al array de convocadosPartidoVisitante un jugador.
  convocarVisitante(jugador) {
    // Comprueba si no existe ya
    if (this.convocadosPartidoVisitante.indexOf(jugador) == -1) {
      this.convocadosPartidoVisitante.push(jugador);
      this.convocadosPartidoVisitante.sort(this.compararPorDorsal);
      this.alertaConvocado(jugador.nombre, jugador.apellidos, jugador.dorsal);
    }
  }

  //Muestra un aviso al convocar a un jugador.
  alertaConvocado(nombre: String, apellidos: String, dorsal: Number) {
    let alertaConvocado = this.alerta.create({
      title: 'Convocado',
      subTitle: 'El jugador ' + nombre + ' ' + apellidos + ' con dorsal ' + dorsal + ' ha sido convocado para disputar el partido.',
    });
    alertaConvocado.present();
    setTimeout(() => alertaConvocado.dismiss(), 2000);
  }
  //Muestra un aviso al desconvocar a un jugador.
  alertaDesconvocado(nombre: String, apellidos: String, dorsal: Number) {
    let alertaDesconvocado = this.alerta.create({
      title: 'Desconvocado',
      subTitle: 'El jugador ' + nombre + ' ' + apellidos + ' con dorsal ' + dorsal + ' ha sido desconvocado, no disputará el partido.',
    });
    alertaDesconvocado.present()
    setTimeout(() => alertaDesconvocado.dismiss(), 2000);
  }

  //Elimina a un jugador del array de convocados.
  desconvocarLocal(jugador) {
    let posicion = this.convocadosPartidoLocal.indexOf(jugador)
    if (posicion > -1) {
      this.convocadosPartidoLocal.splice(posicion, 1);
      this.convocadosPartidoLocal.sort(this.compararPorDorsal);
      this.alertaDesconvocado(jugador.nombre, jugador.apellidos, jugador.dorsal);
    }
  }
  //Elimina a un jugador del array de convocados.
  desconvocarVisitante(jugador) {
    let posicion = this.convocadosPartidoVisitante.indexOf(jugador)
    if (posicion > -1) {
      this.convocadosPartidoVisitante.splice(posicion, 1);
      this.convocadosPartidoVisitante.sort(this.compararPorDorsal);
      this.alertaDesconvocado(jugador.nombre, jugador.apellidos, jugador.dorsal);
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
  nuevoGolLocal(jugador, idPartido, minuto) {
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = jugador.id;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    this.partido.golesLocal = this.partido.golesLocal + 1;
    console.log(this.incidenciasPartido);
  }
  //Método que añade un gol al equipo visitante
  nuevoGolVisitante(jugador, idPartido, minuto) {
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = jugador.id;
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
  //Muestra un aviso al mostrar una tarjeta amarilla al jugador.
  alertaTarjetaAmarilla(jugador, idPartido, minuto) {
    if (!this.tieneTarjetaAmarilla(jugador)) {
      let confirm = this.alerta.create({
        title: '¡Atención!',
        message: '¿Desea mostrar tarjeta amarilla al jugador ' + jugador.nombre + ' ' + jugador.apellidos + ' con dorsal ' + jugador.dorsal + '?',
        buttons: [
          {
            text: 'No',
            handler: () => {
            }
          },
          {
            text: 'Sí',
            handler: () => {
              this.mostrarTarjetaAmarilla(jugador, idPartido, minuto);
            }
          }
        ]
      });
      confirm.present();
    } else {
      let confirm = this.alerta.create({
        title: '¡Atención!',
        message: '¿Desea mostrar tarjeta amarilla al jugador ' + jugador.nombre + ' ' + jugador.apellidos + ' con dorsal ' + jugador.dorsal + '?. Este jugador ya tiene tarjeta amarilla.',
        buttons: [
          {
            text: 'No',
            handler: () => {
            }
          },
          {
            text: 'Sí',
            handler: () => {
              this.mostrarTarjetaAmarilla(jugador, idPartido, minuto);
            }
          }
        ]
      });
      confirm.present();
    }

  }
  //Muestra un aviso al mostrar una tarjeta roja al jugador.
  alertaTarjetaRoja(jugador, idPartido, minuto) {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Desea mostrar tarjeta roja al jugador ' + jugador.nombre + ' ' + jugador.apellidos + ' con dorsal ' + jugador.dorsal + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.mostrarTarjetaRoja(jugador, idPartido, minuto);
          }
        }
      ]
    });
    confirm.present();
  }
  //Aviso que se muestra al añadir un gol del equipo local al partido.
  alertaGolLocal(jugador, idPartido, minuto, equipo) {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Desea añadir un gol a  ' + equipo.nombre + ' marcado por ' + jugador.nombre + ' ' + jugador.apellidos + ' con dorsal ' + jugador.dorsal + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.nuevoGolLocal(jugador, idPartido, minuto);
          }
        }
      ]
    });
    confirm.present();
  }
  //Aviso que se muestra al añadir un gol del equipo visitante al partido.
  alertaGolVisitante(jugador, idPartido, minuto, equipo) {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Desea añadir un gol a  ' + equipo.nombre + ' marcado por ' + jugador.nombre + ' ' + jugador.apellidos + ' con dorsal ' + jugador.dorsal + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.nuevoGolVisitante(jugador, idPartido, minuto);
          }
        }
      ]
    });
    confirm.present();
  }
  //Comparar jugadores por dorsal.
  compararPorDorsal(jugador1, jugador2) {
    if (jugador1.dorsal < jugador2.dorsal) {
      return -1;
    }
    if (jugador1.dorsal > jugador2.dorsal) {
      return 1;
    }
    if (jugador1.dorsal == jugador2.dorsal) {
      return 0;
    }
  }

  //Rellenar observaciones del acta.
  rellenarObservaciones() {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Desea finalizar el partido y rellenar las observaciones del acta?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.rellenaActa = true;
          }
        }
      ]
    });
    confirm.present();
  }

  //Se crea el nuevo acta y se guarda en la BBDD.
  enviarActa() {
    this.acta.id = null;
    this.acta.idPartido = this.partido.id;
    this.acta.fecha = this.partido.fechaPartido;
    this.acta.hora = this.partido.horaPartido;
    this.acta.equipoLocal = this.partido.equipoLocal;
    this.acta.equipoVisitante = this.partido.equipoVisitante;
    this.acta.arbitro = this.arbitro;
    this.acta.convocadosLocal = this.convocadosPartidoLocal;
    this.acta.convocadosVisitante = this.convocadosPartidoVisitante;
    this.acta.golesLocal = this.partido.golesLocal;
    this.acta.golesVisitante = this.partido.golesVisitante;
    this.acta.incidencias = this.incidenciasPartido;
    this.acta.observaciones = this.observaciones;
    //this.partido.estado="Arbitrado";
    console.log(this.acta);
      this.userService.createActa(this.acta).then(
        res => "Acta generada",
        err => console.log(err)
    );
    console.log(this.observaciones);
  }
}
