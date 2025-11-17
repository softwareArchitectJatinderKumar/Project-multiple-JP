import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://projectsapi.lpu.in/';
const AUTH_API_LOCAL = 'https://projectsapi.lpu.in/';//'https://localhost:7125/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  LoginJournalAccessTemp(username: string): Observable<any> {
    return this.http.post(
      AUTH_API_LOCAL + 'security/createjournalToken',
      {
        username
      },
      httpOptions
    );
  }



  loginTemp(username: string,menuName:string=''): Observable<any> {

    const checkData = {
      UserName:username,
      MenuName:menuName
     }

    return this.http.post(
      AUTH_API + 'security/createcommonToken',
      checkData,
      httpOptions
    );
  }

  loginUMSTemp(username: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'security/createumscommonToken',
      {
        username
      },
      httpOptions
    );
  }
 

  loginInternalUser(userId: string, key: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'security/createtoken ',
      {
        userName: userId,
        password: key

      },
      httpOptions
    );
  }


  // getModeratorBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'mod', { responseType: 'text' });
  // }
}


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// const AUTH_API = 'https://projectsapi.lpu.in/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   loginInternalUser(arg0: string, arg1: string) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(private http: HttpClient) {}

//   loginTemp(username: string,menuName:string=''): Observable<any> {

//     const checkData = {
//       UserName:username,
//       MenuName:menuName
//      }

//     return this.http.post(
//       AUTH_API + 'security/createcommonToken',
//       checkData,
//       httpOptions
//     );
//   }

//   loginUMSTemp(username: string): Observable<any> {
//     return this.http.post(
//       AUTH_API + 'security/createumscommonToken',
//       {
//         username
//       },
//       httpOptions
//     );
//   }
// }
