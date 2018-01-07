import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { InicioPage } from '../pages/inicio/inicio';
import { CerrarSesionPage } from '../pages/cerrar-sesion/cerrar-sesion';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = InicioPage;
  pages: Array<{title: string, icon:string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: "Mis Partidos", icon: "home", component: HomePage  },
      { title: "Cerrar Sesión", icon: "log-out", component: CerrarSesionPage  },
    ];
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

