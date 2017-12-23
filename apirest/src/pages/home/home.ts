import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PlayerPage } from '../player/player'
import { TimerComponent } from '../../components/timer/timer'
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  connectedUser: String;
  alertaBotonBorrar: boolean = null;
  playerPage = PlayerPage;
  homePage = HomePage;
  players: any[];
  arbitros: any[];
  partidos: any[]
  playerEliminado: any;
  timer = new TimerComponent();
  goles: Array<{ goleador: String, minuto: String }> = [];

  cargarUsuarios() {
    this.userService.getUsers().then(res => {
      this.players = res;
    },
      error => {
        console.log(error);
      });
  }
  modificaJugador(id, jugador) {
    this.userService.modifyPlayer(id, jugador);
  }
  guardaUsuariosLocal() {
    this.storage.ready().then(() => {
      console.log("Memoria interna preparada");
    });
    this.storage.set("Jugadores", JSON.stringify(this.players));
  }
  escribeUsuariosLocal() {
    this.storage.get("Jugadores").then((jugadores) => {
      console.log(JSON.parse(jugadores));
    });
  }
  cargarArbitros() {
    this.userService.getRefrees().then(res => {
      this.arbitros = res;
    },
      error => {
        console.log(error);
      });
  }
  cargarPartidos() {
    this.userService.getMatches().then(res => {
      this.partidos = res;
    },
      error => {
        console.log(error);
      });
  }
  cargarPartidosArbitro() {
    let usuario;
    //Se busca en memoria interna para no depender de vistas.
    this.storage.get('UsuarioConectado').then(
      res => {
        usuario = JSON.parse(res);
        console.log(JSON.parse(res));
        this.userService.getMatchesByRefree(usuario.id).then(
          res => {
            this.partidos = res;
          },
          err => {
            console.log(err)
          }
        );
      });

  }
  obtenerArbitro() {
    this.userService.getArbitroByUserName(this.navParams.get('usuario')).then(
      res => {
      this.connectedUser = res;
      //Guardamos en memoria local para tener al usuario logueado
        this.storage.set('UsuarioConectado', JSON.stringify(res))
      },
      err => { console.log(err) });

    //this.navCtrl.setRoot(this.homePage);
  }
  eliminaUsuario(nombre: String, apellidos: String) {
    this.userService.deleteUser(nombre, apellidos).then(res => {
      this.playerEliminado = res;
      this.cargarUsuarios();
    },
      error => {
        console.log(error);
      });
  }

  alertaSimple(nombre: String, apellidos: String) {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Seguro quieres eliminar a este jugador?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.eliminaUsuario(nombre, apellidos);
          }
        }
      ]
    });
    confirm.present();
  }

  cambiaAPlayerPage(nombre: String, apellidos: String) {
    this.navCtrl.push(this.playerPage, { nombre, apellidos });
  }

  refrescaUsuarios() {
    this.cargarUsuarios();
  }
  comienzaCuenta() {
    this.timer.start();
  }

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public menu: MenuController,
    public storage: Storage,
    public navParams: NavParams,
  ) {
    this.menu.enable(true);
    this.obtenerArbitro();
  }
  marcaGol() {
    this.goles.push({ goleador: "Diego Costa", minuto: this.timer.minuto + "' " + this.timer.segundos + "''" })
  }

}
