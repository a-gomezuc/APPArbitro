import { NgModule } from '@angular/core';
import { TimerComponent } from './timer/timer';
import { ManejadorErroresComponent } from './manejador-errores/manejador-errores';
@NgModule({
	declarations: [TimerComponent,
    ManejadorErroresComponent],
	imports: [],
	exports: [TimerComponent,
    ManejadorErroresComponent]
})
export class ComponentsModule {}
