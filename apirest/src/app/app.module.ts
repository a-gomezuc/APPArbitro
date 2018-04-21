import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PlayerPage} from '../pages/player/player';
import { InicioPage} from '../pages/inicio/inicio';
import { MatchPage} from '../pages/match/match';
import { CambiarContraseñaPage } from '../pages/cambiar-contraseña/cambiar-contraseña';
import { CerrarSesionPage} from '../pages/cerrar-sesion/cerrar-sesion';
import { TimerComponent} from '../components/timer/timer';
import { GoogleMaps } from '@ionic-native/google-maps';

import {HttpModule} from '@angular/http'
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ManejadorErroresComponent } from '../components/manejador-errores/manejador-errores';
import { MapaPage } from '../pages/mapa/mapa';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayerPage,
    InicioPage,
    MatchPage,
    CerrarSesionPage,
    MapaPage,
    CambiarContraseñaPage,
    TimerComponent,
    ManejadorErroresComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayerPage,
    InicioPage,
    MatchPage,
    CerrarSesionPage,
    MapaPage,
    CambiarContraseñaPage,
    TimerComponent,
    ManejadorErroresComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    ManejadorErroresComponent
  ]
})
export class AppModule {}
