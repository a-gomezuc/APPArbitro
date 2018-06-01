import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { InicioPage } from '../pages/inicio/inicio';
import { CerrarSesionPage } from '../pages/cerrar-sesion/cerrar-sesion';
import { CambiarContraseñaPage } from '../pages/cambiar-contraseña/cambiar-contraseña';
import { IonicPage, MenuController, AlertController, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ManejadorErroresComponent } from '../components/manejador-errores/manejador-errores';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = InicioPage;
  inicioPage: any = InicioPage;
  pages: Array<{ title: string, icon: string, component: any }>;
  private manejadorErrores = new ManejadorErroresComponent(this.alerta);
  private navParams: NavParams;
  private navCtrl: NavController;


  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private alerta: AlertController,
    private menu: MenuController,
    private userService: UserServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: "Mis Partidos pendientes", icon: "home", component: HomePage },
      { title: "Cambiar contraseña", icon: "create", component: CambiarContraseñaPage },
      { title: "Cerrar Sesión", icon: "log-out", component: "" }
    ];
  }
  openPage(page) {
    if (page.title == "Cerrar Sesión") {
      this.alertaCerrarSesion();
    }
    else {
      this.nav.setRoot(page.component);
    }
  }
  cerrarSesion() {
    this.userService.logout().then(
      res => {
        console.log(res),
          this.nav.setRoot(this.inicioPage)
      },
      error => this.manejadorErrores.manejarError(error));
  }
  alertaCerrarSesion() {
    let confirm = this.alerta.create({
      title: '¡Atención!',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });
    confirm.present();
  }
}

