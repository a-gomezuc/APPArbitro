import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
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
  private userLogged: string;//Usuario logueado actuamente en el sistema
  public url:String="http://localhost:8080"
  constructor(
    public http: Http
  ) {}

  getUsers(){
    return this.http
    .get(this.url+'/jugadores')
    .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
    .toPromise();
    }
    modifyPlayer(id,jugador){
      return this.http
      .put((this.url+'/jugadores/'+id), jugador)
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
      }
    getRefrees(){
      return this.http
      .get(this.url+'/arbitros')
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
    }
    getMatches(){
      return this.http
      .get(this.url+'/partidos')
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
    }
    getMatchesByRefree(refree:String){
      return this.http
      .get(this.url+'/partidos/arbitro/'+refree)
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
    }
    getArbitroByUserName(username:String){
      return this.http.get(this.url+"/arbitros/nombreUsuario/"+username)
      .map(res=>res.json(),error=>{console.log(error)}).toPromise();
    }
    getArbitroById(id:String){
      return this.http.get(this.url+"/arbitros/"+id)
      .map(res=>res.json(),error=>{console.log(error)}).toPromise();
    }
    getPlayerDni(dni:String){
      return this.http
      .get(this.url+'/jugadores/dni/'+dni)
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
      }
      getUser(nombre:String, apellidos:String){
        return this.http
        .get(this.url+'/jugadores/'+nombre+'/'+apellidos)
        .map(res => res.json(),
            err => {
              console.log(err);
            }
          )
        .toPromise();
        }
    deleteUser(nombre:String, apellidos:String){
      return this.http
      .delete(this.url+'/jugadores/'+nombre+'/'+apellidos)
      .map(res => res.json(),
          err => {
            console.log(err);
          }
        )
      .toPromise();
    }
   login(username: String, password: String) {
      if (username !== "") {
          let headers = new Headers();//Creación de la cabecera que le tenemos que pasar al método para que nos loguee correctamente.
          this.credentials = btoa(username + ':' + password);//Encriptación de las credenciales del usuario.
          headers.append('Authorization', 'Basic ' + this.credentials);//Añadimos  a la cabecera las credenciales.
          return this.http.get(this.url+"/iniciarSesion", { headers: headers })
              .map(response => {
                  this.handleLogIn(response);
                  //localStorage.setItem("user", response.json());
                  return response.json();},
                  error => this.handleError(error)
              ).toPromise();
      } else {
          //return Observable.throw("Server error (401): Introduzca correctamente sus datos de usuario.");
      }
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
