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
  convocados: any[];
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
  //Opcion mediante botón
  convocar(jugador){
    // Comprueba si no existe ya
    if(this.convocados.indexOf(jugador)==-1)
    this.convocados.push(jugador);
  }
  isNotConvocado(jugador){
    if (jugador==undefined){
      return true;
    }
    else{
      return(this.convocados.indexOf(jugador)==-1);
  }
}
//Opcion con radio buttons 
  seleccionarConvocados(){
      let alert = this.alerta.create();
      alert.setTitle('Qué jugadores desea convocar?');
    this.players.forEach(element => {
      alert.addInput({
        type: 'checkbox',
        label: element.nombre+' '+element.apellidos,
        value: element,
        checked: false
    });
    });
      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Aceptar',
        handler: (data: any) => {
            console.log('Checkbox data:', data);
        }
      });
  
      alert.present();
  }
  isSancionado(jugador){
    if (jugador.fechaSancion==undefined || jugador.fechaSancion=="" || jugador.fechaSancion==null){
      return false
    }
    else{ 
      return true;
    }
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
      this.partidos.forEach(partido => {
       this.userService.getArbitroById(partido.idArbitro).then(res=>{
         console.log(res)
      partido.arbitro=res},
    error=>{console.log(error)});
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
            //Por cada partido guarda su arbitro (ya que solo contiene el id)
            this.partidos.forEach(partido => {
              this.userService.getArbitroById(partido.idArbitro).then(arb=>{
                console.log(arb)
             partido.arbitro=arb},
           error=>{console.log(error)});
             });
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

  cambiaAPlayerPage(dni:String) {
    this.navCtrl.push(this.playerPage, {dni});
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
    this.convocados=[];
  }
  marcaGol() {
    this.goles.push({ goleador: "Diego Costa", minuto: this.timer.minuto + "' " + this.timer.segundos + "''" })
  }

}
