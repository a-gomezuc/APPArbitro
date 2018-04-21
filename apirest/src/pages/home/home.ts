import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, MenuController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PlayerPage } from '../player/player'
import { MatchPage } from '../match/match'
import { TimerComponent } from '../../components/timer/timer'
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';
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
  matchPage = MatchPage;
  players: any[];
  arbitros: any[];
  partidos: any[]
  playerEliminado: any;
  timer = new TimerComponent();
  manejadorErrores = new ManejadorErroresComponent(this.alerta);
  goles: Array<{ goleador: String, minuto: String }> = [];

  constructor(
    public loadingCtrl : LoadingController,
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public alerta: AlertController,
    public menu: MenuController,
    public storage: Storage,
    public navParams: NavParams,
  ) {
    this.menu.enable(true);
    this.obtenerArbitroYCargarPartidos();
  }

  modificaJugador(id, jugador) {
    this.userService.modifyPlayer(id, jugador);
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
            this.manejadorErrores.manejarError(err);
          }
        );
      });

  }
  isPartidosVacio(){
    if(this.partidos == undefined){
      return true;
    }
    else{
    return (this.partidos.length==0)
  }
  }
  
  obtenerArbitroYCargarPartidos() {
    let loader = this.loadingCtrl.create({
      content:"Cargando partidos"
    });
    loader.present();
    if(this.navParams.get('usuario')!=undefined){
    this.userService.getArbitroByUserName(this.navParams.get('usuario')).then(
      res => {
        this.connectedUser = res;
        //Guardamos en memoria local para tener al usuario logueado
        this.storage.set('UsuarioConectado', JSON.stringify(res)).then(() => this.cargarPartidosArbitro())
        loader.dismiss();
      },
      err => { 
        this.manejadorErrores.manejarError(err);
        loader.dismiss();
      });
    }
    else{
      this.cargarPartidosArbitro();
      loader.dismiss();
    }
  }


  cambiaAMatchPage(idPartido: String) {
    this.navCtrl.push(this.matchPage, { idPartido })
  }

  obtenerPartido(idPartido:String){
    this.userService.getMatchById(idPartido).then(
      res=> {return res;},
      err=>{
        this.manejadorErrores.manejarError(err);
      }
    )
  }

}
