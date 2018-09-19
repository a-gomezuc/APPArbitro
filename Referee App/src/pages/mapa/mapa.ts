import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerOptions,
  LatLng,
  Marker
} from '@ionic-native/google-maps';

/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  map: GoogleMap;
  estadio: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, ) {
    this.estadio=this.navParams.get('estadio');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  //Carga el mapa
  loadMap() {

    this.map = GoogleMaps.create(document.getElementById('map_canvas')/*, mapOptions*/);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then((data:any) => {
        //this.alertaPrueba();
        let coordinates: LatLng = new LatLng(this.estadio.longitud, this.estadio.latitud);
        let position = {
          target: coordinates,
          zoom: 17
        };
        this.map.animateCamera(position);
        let markerOptions: MarkerOptions = {
          position: coordinates,
          title: this.estadio.nombre
        };
        this.map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
      })
        // Now you can use all methods safely.
        // this.map.addMarker({
        //   title: 'My Position',
        //   icon: 'blue',
        //   animation: 'DROP',
        //   position: {
        //     lat: 40.291570,
        //     lng: -3.826438
        //   }
        // }).then((marker:Marker)=>
        // marker.showInfoWindow());
        // this.map.moveCamera({
        //   target: {
        //     lat: 40.291570,
        //     lng: -3.826438
        //   }
        // });
      });

  }
  getPosition(): void {

  }

}
