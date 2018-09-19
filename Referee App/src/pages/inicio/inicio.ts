import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PlayerPage } from '../player/player'
import { HomePage } from '../home/home'
import { RecordarContraseñaPage } from '../recordar-contrase\u00F1a/recordar-contrase\u00F1a';

/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
  public playerPage = PlayerPage;
  public homePage = HomePage;
  private pass: String;
  private user: String;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alerta: AlertController,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public userService: UserServiceProvider) {
    this.menu.enable(false);
  }

  //Cambia a la página home.
  cambiaAHomePage() {
    this.userService.login(this.user, this.pass).then(res => {
      this.navCtrl.setRoot(this.homePage, { usuario: this.user });
    },
      error => {
        this.alertaAviso();
      })
  }

  //Cambia a la página de recordar contraseña.
  cambiaARecordarContraseniaPage(){
    this.navCtrl.push(RecordarContraseñaPage);
  }

  //Indica que la contraseña es incorrecta.
  alertaAviso() {
    let alertaAviso = this.alerta.create({
      title: 'Contraseña incorrecta',
      subTitle: 'Su contraseña es incorrecta',
      buttons: ['Aceptar']
    });
    alertaAviso.present();

  }
  presentLoading(){
    
  }

  ionViewDidLoad() {
  }

}
