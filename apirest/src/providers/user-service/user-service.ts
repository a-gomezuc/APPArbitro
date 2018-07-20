import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';



/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  private isLogged: boolean = false;//Variable con la cual sabremos si el uisuario esta logeuado o no el sistema.
  private credentials: string;//Credenciales del usuario (Encriptadas).
  private headers: any;
  public url: String = "http://192.168.1.102:8080"
  constructor(
    public http: Http,
  ) { }

  //JUGADORES

  getPlayers() {
    return this.http
      .get(this.url + '/jugadores', { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  modifyPlayer(id, jugador) {
    return this.http
      .put((this.url + '/jugadores/' + id), jugador, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }

  deletePlayer(nombre: String, apellidos: String) {
    return this.http
      .delete(this.url + '/jugadores/' + nombre + '/' + apellidos, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }

  getPlayerId(id: String) {
    return this.http
      .get(this.url + '/jugadores/id/' + id, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  getPlayer(nombre: String, apellidos: String) {
    return this.http
      .get(this.url + '/jugadores/' + nombre + '/' + apellidos, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }

  //EQUIPOS
  getEquipoByID(id: String) {
    return this.http.get(this.url + '/equipos/id/' + id, { headers: this.headers }).map(res => res.json(),
      error => console.log(error)).toPromise();
  }



  //PARTIDOS
  getMatches() {
    return this.http
      .get(this.url + '/partidos', { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  getMatchesByReferee(referee: String) {
    return this.http
      .get(this.url + '/partidos/arbitro/' + referee + '/estado/Pendiente', { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  getMatchById(id: String) {
    return this.http
      .get(this.url + '/partidos/' + id, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }

  sendNewPassword(email: String){
    return this.http
    .get(this.url + '/arbitros/clave/' + email, { headers: this.headers })
    .map(res => {console.log(res.json())},
      err => {
        console.log(err);
      }
    )
    .toPromise();
}

  modifyMatch(id, partido) {
    return this.http
      .put((this.url + '/partidos/' + id), partido, { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }


  //ÁRBITROS
  getReferees() {
    return this.http
      .get(this.url + '/arbitros', { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  getArbitroByUserName(username: String) {
    return this.http.get(this.url + "/arbitros/nombreUsuario/" + username, { headers: this.headers })
      .map(res => res.json(), error => { console.log(error) }).toPromise();
  }
  getArbitroById(id: String) {
    return this.http.get(this.url + "/arbitros/" + id, { headers: this.headers })
      .map(res => res.json(), error => { console.log(error) }).toPromise();
  }
  modifyReferee(id: String, arbitro: any) {
    return this.http.put(this.url + "/arbitros/" + id, arbitro, { headers: this.headers }).map
      (res => res.json(),
      error => { console.log(error) }).toPromise();
  }

  //ACTA
  createActa(acta) {

    return this.http
      .post(this.url + '/actas', acta, { headers: this.headers })
      .map(
        res => res.json(),
        err => console.log(err)
      ).toPromise();
  }

  //SESION
  login(username: String, password: String) {
    if (username !== "") {
      this.headers = new Headers();//Creación de la cabecera que le tenemos que pasar al método para que nos loguee correctamente.
      this.credentials = btoa(username + ':' + password);//Encriptación de las credenciales del usuario.
      this.headers.append('Authorization', 'Basic ' + this.credentials);//Añadimos  a la cabecera las credenciales.
      return this.http.get(this.url + "/iniciarSesion/ROLE_ARBITRO", { headers: this.headers })
        .map(response => {
          this.handleLogIn(response);
          //localStorage.setItem("user", response.json());
          return response.json();
        },
          error => this.handleError(error)
        ).toPromise();
    } else {
      //return Observable.throw("Server error (401): Introduzca correctamente sus datos de usuario.");
    }
  }
  logout() {
    return this.http
      .get(this.url + '/cerrarSesion', { headers: this.headers })
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }
  private handleLogIn(response) {
    this.isLogged = true;
  }
  private handleError(error: any) {
    console.error(error);
    switch (error.status) {
      case 409:
        return Observable.throw("Server error (" + error.status + "): El nombre de usuario ya está en uso");
      case 404:
        return Observable.throw("Server error (" + error.status + "): Ha ocurrido algún error, vuelva a intentarlo");
      case 401:
        return Observable.throw("Server error (" + error.status + "): Introduzca correctamente sus datos de usuario.");
    }
  }
}
