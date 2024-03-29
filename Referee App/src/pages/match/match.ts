import { Component } from '@angular/core';
import { AlertController, MenuController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PlayerPage } from '../player/player'
import { HomePage } from '../home/home'
import { TimerComponent } from '../../components/timer/timer'
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular/platform/platform';
import { MapaPage } from '../mapa/mapa';
import { BackgroundMode } from '@ionic-native/background-mode';



/**
 * Generated class for the MatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {
  timer = new TimerComponent();
  manejadorErrores = new ManejadorErroresComponent(this.alerta);
  playerPage = PlayerPage;
  homePage = HomePage;
  mapaPage = MapaPage;
  partido: any;
  arbitro: any;
  busquedaJugadoresLocales: any;
  busquedaJugadoresVisitantes: any;
  busquedaJugadoresLocalesConvocados: any;
  busquedaJugadoresVisitantesConvocados: any;
  convocadosPartidoLocal: any[];
  convocadosPartidoVisitante: any[];
  arbitrando: Boolean;
  modificando: Boolean;
  rellenaActa: Boolean;
  incidenciasPartido: any[];
  jugadoresConTarjetaAmarilla: any[];
  jugadoresConTarjetaRoja: any[];
  observaciones: String;
  acta: any;
  reanudar: Boolean;
  mostrarComienzo: Boolean;
  activarVibrar: Boolean;
  minutoVibrar: Number;
  valorBuscado: String;
  valorBuscadoConvocados: String;
  idCapitanLocal: String;
  idsPorterosLocal: String[];
  idCapitanVisitante: String;
  idsPorterosVisitante: String[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public storage: Storage,
    public plt: Platform,
    public backGroundMode : BackgroundMode ) {
    this.obtenerPartidoyArbitro();
    this.convocadosPartidoLocal = [];
    this.convocadosPartidoVisitante = [];
    this.arbitrando = false;
    this.modificando = false;
    this.rellenaActa = false;
    this.incidenciasPartido = [];
    this.jugadoresConTarjetaAmarilla = [];
    this.jugadoresConTarjetaRoja = [];
    this.idsPorterosLocal = [];
    this.idsPorterosVisitante = [];
    this.observaciones = '';
    this.acta = {};
    this.reanudar = false;
    this.mostrarComienzo = true;
    this.backGroundMode.setDefaults({
      title:"Arbitrando..." ,
      text: "Referee App realizando tareas en segundo plano."
  });
    this.backGroundMode.enable();
  }


  //Obtiene el partido y el árbitro.
  obtenerPartidoyArbitro() {
    let loader = this.loadingCtrl.create({
      content: "Cargando partido"
    });
    loader.present();
    this.userService.getMatchById(this.navParams.get("idPartido")).then(
      res => {
        this.partido = res;
        this.obtenerEquipoLocal();
        this.obtenerEquipoVisitante();
        this.obtenerArbitro();
        loader.dismiss();
      },
      error => {
        this.manejadorErrores.manejarError(error);
        loader.dismiss();
      }
    )

  }

  //Obtiene los datos del árbitro.
  obtenerArbitro() {
    this.userService.getArbitroById(this.partido.idArbitro).then(
      res => {
        this.arbitro = res;
      },
      err => this.manejadorErrores.manejarError(err)
    );
  }

  //Obtiene los datos del equipo local.
  obtenerEquipoLocal() {
    this.userService.getEquipoByID(this.partido.equipoLocalId).then(
      res => {
        this.partido.equipoLocal = res;
        this.partido.equipoLocal.plantillaEquipo.sort(this.compararPorDorsal);
        this.busquedaJugadoresLocales = this.partido.equipoLocal.plantillaEquipo;
      },
      err => {
        this.manejadorErrores.manejarError(err);
      }
    )
  }

  //Obtiene los datos del equipo visitante.
  obtenerEquipoVisitante() {
    this.userService.getEquipoByID(this.partido.equipoVisitanteId).then(
      res => {
        this.partido.equipoVisitante = res;
        this.partido.equipoVisitante.plantillaEquipo.sort(this.compararPorDorsal);
        this.busquedaJugadoresVisitantes = this.partido.equipoVisitante.plantillaEquipo;
      },
      err => {
        this.manejadorErrores.manejarError(err);
      }
    )
  }

  //Modifica el estado del partido y genera el acta.
  modificarPartidoYCrearActa(acta) {
    let loader = this.loadingCtrl.create({
      content: "Enviando acta..."
    });
    loader.present();
    let alertaActa = this.alerta.create({
      title: 'Acta enviada',
      subTitle: 'El acta se ha enviado correctamente.',
    });
    this.partido.estado = "Pendiente acta"
    this.userService.modifyMatch(this.partido.id, this.partido).then(
      res => {
        this.partido = res;
        this.userService.createActa(this.acta).then(
          res => {
            this.cambiaAHomePage()
            loader.dismiss();
            alertaActa.present();
          },
          err => {
            this.manejadorErrores.manejarError(err)
            loader.dismiss();
          }
        );
      },
      err => {
        this.manejadorErrores.manejarError(err);
        loader.dismiss();
      }
    );
  }

  //Para conocer si un jugador está sancionado.
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
    this.busquedaJugadoresLocalesConvocados = this.convocadosPartidoLocal;
    this.busquedaJugadoresVisitantesConvocados = this.convocadosPartidoVisitante;
  }
  
  //Método para aplazar un partido
  aplazar(){
    let loader = this.loadingCtrl.create({
      content: "Aplazando partido..."
    });
    loader.present();
    let alertaAplazar = this.alerta.create({
      title: 'Partido aplazado',
      subTitle: 'El partido se ha aplazado correctamente.',
    });
    this.partido.estado = "Aplazado"
    this.userService.modifyMatch(this.partido.id, this.partido).then(
      res => {
        this.cambiaAHomePage()
        loader.dismiss();
        alertaAplazar.present();
        this.partido = res;
      },
      err => {
        loader.dismiss();
        this.manejadorErrores.manejarError(err);
      }
    );
  }
  //Método que da paso al arbitraje de un partido.
  alertaArbitrar() {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '<p>Compruebe los jugadores convocados.</p><p> Ha convocado ' + this.convocadosPartidoLocal.length + ' jugadores locales y ' + this.convocadosPartidoVisitante.length + ' jugadores visitantes.</p>',
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
    //Método que da paso a aplazar un partido.
    alertaAplazar() {
      let confirm = this.alerta.create({
        title: '¿Desea aplazar el partido',
        message: 'El partido no estará disponible para arbitrar hasta que el comité fije una nueva fecha.',
        buttons: [
          {
            text: 'No',
            handler: () => {
            }
          },
          {
            text: 'Sí',
            handler: () => {
              this.aplazar();
            }
          }
        ]
      });
      confirm.present();
    }
    //Método que da paso a crear un acta cuando uno de los equipos no se presenta.
    alertaNoPresenta(){    let confirm = this.alerta.create({
      title: 'Seleccione el equipo no presentado',
      message: 'Se generará un acta con tres goles en contra para el equipo no presentado.',
      buttons: [
        {
          text: 'Local',
          handler: () => {
            this.localNoPresentado();
          }
        },
        {
          text: 'Visitante',
          handler: () => {
            this.visitanteNoPresentado();
          }
        }
      ]
    });
    confirm.present();}

  //Método que cambia a la página de jugador.
  cambiaAPlayerPage(imagenEquipo:String, nombreEquipo: String, jugador: any) {
    this.navCtrl.push(this.playerPage, { imagenEquipo, nombreEquipo, jugador });
  }
  //Método que cambia a la página del mapa.
  cambiaAMapaPage(estadio: any) {
    this.navCtrl.push(this.mapaPage, { estadio });
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
    incidencia.jugador = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = jugador.id;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.jugador.dorsal = jugador.dorsal;
    incidencia.jugador.nombre = jugador.nombre +' '+ jugador.apellidos;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    this.partido.golesLocal = this.partido.golesLocal + 1;
  }
  //Método que añade un gol al equipo visitante
  nuevoGolVisitante(jugador, idPartido, minuto) {
    var incidencia: any = {};
    incidencia.jugador = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = jugador.id;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.jugador.dorsal = jugador.dorsal;
    incidencia.jugador.nombre = jugador.nombre +' '+ jugador.apellidos;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
    this.partido.golesVisitante = this.partido.golesVisitante + 1;
  }
  //Muestra una tarjeta amarilla al jugador, si ya tiene una, le muestra una amarilla y una roja. Añade todo a incidencias.
  mostrarTarjetaAmarilla(jugador, idPartido, minuto) {
    let posicion = this.jugadoresConTarjetaAmarilla.indexOf(jugador)
    var incidencia: any = {};
    incidencia.jugador = {};
    if (posicion <= -1) {
      this.jugadoresConTarjetaAmarilla.push(jugador);
      incidencia.id = null;
      incidencia.tipo = "AMARILLA";
      incidencia.idJugador = jugador.id;
      incidencia.idPartido = idPartido;
      incidencia.minuto = minuto;
      incidencia.jugador.dorsal = jugador.dorsal;
      incidencia.jugador.nombre = jugador.nombre +' '+ jugador.apellidos;
      incidencia.observaciones = "";
      this.incidenciasPartido.push(incidencia);
    }
    if (posicion > -1) {
      incidencia.id = null;
      incidencia.tipo = "AMARILLA";
      incidencia.idJugador = jugador.id;
      incidencia.idPartido = idPartido;
      incidencia.minuto = minuto;
      incidencia.jugador.dorsal = jugador.dorsal;
      incidencia.jugador.nombre = jugador.nombre +' '+ jugador.apellidos;
      incidencia.observaciones = "Segunda tarjeta amarilla";
      this.incidenciasPartido.push(incidencia);
      this.mostrarTarjetaRoja(jugador, idPartido, minuto);
    }
  }
  //Muestra una tarjeta roja al jugador.
  mostrarTarjetaRoja(jugador, idPartido, minuto) {
    this.jugadoresConTarjetaRoja.push(jugador);
    var incidencia: any = {};
    incidencia.jugador = {};
    incidencia.id = null;
    incidencia.tipo = "ROJA";
    incidencia.idJugador = jugador.id;
    incidencia.idPartido = idPartido;
    incidencia.minuto = minuto;
    incidencia.jugador.dorsal = jugador.dorsal;
    incidencia.jugador.nombre = jugador.nombre +' '+ jugador.apellidos;
    incidencia.observaciones = "";
    this.incidenciasPartido.push(incidencia);
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


  //Cambio a la página principal
  cambiaAHomePage() {
    this.navCtrl.setRoot(this.homePage, { usuario: this.arbitro.nombreUsuario });
  }

  //Se crea el nuevo acta y se guarda en la BBDD.
  enviarActa() {
    this.acta.id = null;
    this.acta.grupo = this.partido.grupo;
    this.acta.idPartido = this.partido.id;
    this.acta.fecha = this.partido.fechaPartido;
    this.acta.hora = this.partido.horaPartido;
    this.acta.nombreEquipoLocal = this.partido.equipoLocal.nombre;
    this.acta.idEquipoLocal = this.partido.equipoLocal.id;
    this.acta.escudoEquipoLocal = this.partido.equipoLocal.imagenEquipo;
    this.acta.nombreEquipoVisitante = this.partido.equipoVisitante.nombre;
    this.acta.idEquipoVisitante = this.partido.equipoVisitante.id;
    this.acta.escudoEquipoVisitante = this.partido.equipoVisitante.imagenEquipo;
    this.acta.idArbitro = this.arbitro.id;
    this.acta.idsPorterosLocal = this.idsPorterosLocal;
    this.acta.idsPorterosVisitante = this.idsPorterosVisitante;
    this.acta.idCapitanLocal = this.idCapitanLocal;
    this.acta.idCapitanVisitante = this.idCapitanVisitante;
    this.acta.nombreArbitro = this.arbitro.nombre;
    this.acta.convocadosLocal = this.convocadosPartidoLocal;
    this.acta.convocadosVisitante = this.convocadosPartidoVisitante;
    this.acta.golesLocal = this.partido.golesLocal;
    this.acta.golesVisitante = this.partido.golesVisitante;
    this.acta.incidencias = this.incidenciasPartido;
    this.acta.observaciones = this.observaciones;
    this.acta.jornada = this.partido.jornada;
    this.modificarPartidoYCrearActa(this.acta);
  }

  //Parar el cronómetro.
  pararCrono() {
    this.timer.stop();
    this.mostrarComienzo = true;
    this.reanudar = true;
  }
  alertaReiniciar() {
    let reiniciar = this.alerta.create({
      title: '¡Atención!',
      message: '¿Desea reiniciar el cronómetro? Los contadores comenzarán de 0.',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.reiniciarCrono();
          }
        }
      ]
    });
    reiniciar.present();
  }

  //Reanudar el cronómetro.
  reiniciarCrono() {
    this.timer.reinicia();
    this.mostrarComienzo = true;
    this.reanudar = false;
  }

  //Comenzar cronómetro.
  comenzarCrono() {
    this.timer.start();
    this.mostrarComienzo = false;
  }
  //Habilita la modificación durante el arbitraje.
  modificar() {
    this.pararCrono();
    this.modificando = true;
  }
  //Guarda los cambios realizados en la modificación.
  guardar() {
    this.modificando = false;
    this.busquedaJugadoresLocalesConvocados = this.convocadosPartidoLocal;
    this.busquedaJugadoresVisitantesConvocados = this.convocadosPartidoVisitante;
  }
  //Notifica si se activa la vibración
  vibrar() {
    this.timer.setActivarVibrar(this.activarVibrar);
    if (this.activarVibrar) {
    }
  }
  //Cambia el minuto de vibración
  cambiaMinuto() {
    this.timer.setMinutoVibrar(this.minutoVibrar);
  }

  cambiaBusquedaSinConvocados() {
    this.busquedaJugadoresLocales = this.busquedaLocales();
    this.busquedaJugadoresVisitantes = this.busquedaVisitantes();
  }
  cambiaBusquedaConvocados() {
    this.busquedaJugadoresLocalesConvocados = this.busquedaLocalesConvocados();
    this.busquedaJugadoresVisitantesConvocados = this.busquedaVisitantesConvocados();
  }

  //Obtiene los jugadores locales por dorsal.
  busquedaLocales() {
    return this.partido.equipoLocal.plantillaEquipo.filter((item) => {
      if (this.valorBuscado.length == 0) {
        return true;
      }
      else {
        return item.dorsal == this.valorBuscado;
      }
    });
  }
  //Obtiene los jugadores visitantes por dorsal.
  busquedaVisitantes() {
    return this.partido.equipoVisitante.plantillaEquipo.filter((item) => {
      if (this.valorBuscado.length == 0) {
        return true;
      }
      else {
        return item.dorsal == this.valorBuscado;
      }
    });
  }
  //Obtiene los jugadores locales convocados por dorsal.
  busquedaLocalesConvocados() {
    return this.convocadosPartidoLocal.filter((item) => {
      if (this.valorBuscadoConvocados.length == 0) {
        return true;
      }
      else {
        return item.dorsal == this.valorBuscadoConvocados;
      }
    });
  }
  //Obtiene los jugadores visitantes convocados por dorsal.
  busquedaVisitantesConvocados() {
    return this.convocadosPartidoVisitante.filter((item) => {
      if (this.valorBuscadoConvocados.length == 0) {
        return true;
      }
      else {
        return item.dorsal == this.valorBuscadoConvocados;
      }
    });
  }
  //Devuelve si un jugador es capitán.
  esCapitanLocalPartido(jugadorLocal: any) {
    if (jugadorLocal != undefined) {
      return (jugadorLocal.id == this.idCapitanLocal);
    }
    else return false;
  }
  //Devuelve si un jugador es capitán.
  esCapitanVisitantePartido(jugadorVisitante: any) {
    if (jugadorVisitante != undefined) {
      return (jugadorVisitante.id == this.idCapitanVisitante)
    }
    else return false;
  }
  //Devuelve si un jugador es portero.
  esPorteroLocalPartido(jugadorLocal: any) {
    if (jugadorLocal != undefined) {
      return (this.idsPorterosLocal.indexOf(jugadorLocal.id)>-1);
    }
    else return false;
  }
  //Devuelve si un jugador es portero.
  esPorteroVisitantePartido(jugadorVisitante: any) {
    if (jugadorVisitante != undefined) {
      return (this.idsPorterosVisitante.indexOf(jugadorVisitante.id)>-1)
    }
    else return false;
  }

  //Envía un acta con el equipo local no presentado.
  localNoPresentado(){
    var i;
    for (i=0; i<=2;i++){
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = "000";
    incidencia.idPartido = this.partido.id;
    incidencia.minuto = "0";
    incidencia.observaciones = "Gol por equipo local no presentado.";
    this.incidenciasPartido.push(incidencia);
    }
    this.partido.golesVisitante = 3;
    this.partido.golesLocal = 0;
    this.observaciones= "No presentado equipo local."
    this.enviarActa();
  }
  //Envía un acta con el equipo visitante no presentado.
  visitanteNoPresentado(){
    var i;
    for (i=0; i<=2;i++){
    var incidencia: any = {};
    incidencia.id = null;
    incidencia.tipo = "GOL";
    incidencia.idJugador = "000";
    incidencia.idPartido = this.partido.id;
    incidencia.minuto = "0";
    incidencia.observaciones = "Gol por equipo visitante no presentado.";
    this.incidenciasPartido.push(incidencia);
    }
    this.partido.golesVisitante = 0;
    this.partido.golesLocal = 3;
    this.observaciones= "No presentado equipo visitante."
    this.enviarActa();
  }

  //Indica si el equipo local tiene delegado.
  existeDelegadoLocal(){
    if(this.partido!= undefined && this.partido.equipoLocal !=undefined){
    return !(this.partido.equipoLocal.delegado == undefined || this.partido.equipoLocal.delegado == null || this.partido.equipoLocal.delegado == '');
    }
    else{
      return false;
    }
  }

    //Indica si el equipo visitante tiene delegado.
  existeDelegadoVisitante(){
    if(this.partido!=undefined && this.partido.equipoVisitante !=undefined){
    return !(this.partido.equipoVisitante.delegado == undefined || this.partido.equipoVisitante.delegado == null || this.partido.equipoVisitante.delegado == '');
    }
    else{
      return false;
    }
  }
}
