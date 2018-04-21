import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CambiarContraseñaPage } from './cambiar-contraseña';
import { ManejadorErroresComponent } from '../../components/manejador-errores/manejador-errores';

@NgModule({
  declarations: [
    CambiarContraseñaPage,
  ],
  imports: [
    IonicPageModule.forChild(CambiarContraseñaPage),
  ],
})
export class CambiarContraseñaPageModule {}
