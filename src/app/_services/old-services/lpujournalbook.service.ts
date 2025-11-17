import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
const AUTH_API = 'https://projectsapi.lpu.in/';
//  const AUTH_API = 'https://localhost:7125/';// 'https://projectsapi.lpu.in/';//'https://projectsapi.lpu.in/'; //
const AUTH_API_LOCAL = 'https://projectsapi.lpu.in/';

@Injectable({
  providedIn: 'root'
})
export class LpujournalbookService {
  baseUrl = AUTH_API;

  constructor(private http: HttpClient, private storageService: StorageService) { }
  private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpbk5hbWUiOiIyNTg5OSIsIkRlcGFydG1lbnROYW1lIjoiTi9BIiwiUm9sbElkIjoiNTAiLCJlbWFpbElkIjoiamF0aW4uMjU4OTlAbHB1LmNvLmluIiwiTkFNRSI6IkphdGluIFNhcnBhbCIsImlzQWN0aXZlIjoiVHJ1ZSIsIlVuaXF1ZWlkIjoiYmRmYWU4MWQtMDUxNy00M2ZjLWFjMzctZjM0ZDExODRmZjY3IiwiSXNQYXJlbnQiOiJGYWxzZSIsIlVzZXJUeXBlIjoiTi9BIiwiU3BlY2lhbEJsb2NrIjoiTi9BIiwibmJmIjoxNzIxODgxODU1LCJleHAiOjE3NTM0MTc4NTUsImlhdCI6MTcyMTg4MTg1NSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEyNS8iLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MTI1LyJ9.K8Pswv0q8MtTJ_QHOyX2TSksR6x888AdYVCqd5f1tTI';//
  GetAllBooksDetails(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    // return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetBooksMasterData`, httpOptions);
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetAllJournalData`, httpOptions);
  }

  GetBooksDataWithEditorDetails(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetBooksDataWithEditorDetails`, httpOptions);
  }
  GetJournalBookDetailsById(BookId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetJournalBookDetailsById?Id=` + BookId, httpOptions);
  }
  GetJournalEditorsDetailsByBookId(BookId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetJournalEditorsDetailsByBookId?Id=` + BookId, httpOptions);
  }
  GetJournalAuthorDetails(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetJournalAuthorDetails`, httpOptions);
  }


  GetBookTabsDetails(BookId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    }; //GetJournalBooksDetailsTabs?BookId=
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetJournalBooksDetailsTabs?BookId=`+BookId, httpOptions);
  }


  //24-sep-24
  GetAllJournalMasterwithEditorDetails(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetAllJournalMasterwithEditorDetails`, httpOptions);
  }

  //26-09-24
//GetJournalDetailsforAboutPage?JournalId=29
  GetJournalDetailsforAboutPage(JournalId: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetJournalDetailsforAboutPage?JournalId=` + JournalId, httpOptions);
  }
  GetAllJournalEditorsDetails(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      })
    };
    return this.http.get<any>(`${this.baseUrl}api/LpuJournal/GetAllJournalEditorsDetails`, httpOptions);
  }




  // 30-09-24

  
  JournalMasterNewEntry(dataSoft: FormData): Observable<any> {
    var authToken = this.storageService.getUser();
    let headers = new HttpHeaders()
      // .set('Authorization', 'Bearer ' + authToken)
      .set('Authorization', 'Bearer ' + authToken)
    return this.http.post(
      AUTH_API + 'LpuJournal/JournalMasterNewEvent',
      dataSoft,
      { headers }
    );
  }


  GetJournalProperties(): Observable<any> {
    var authToken = this.storageService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      })
    };
    return this.http.get<any>(`${AUTH_API}api/LpuJournal/GetJournalProperties`, httpOptions);
  }


  addJournalData(dataSoft:FormData): Observable<any> {
    debugger;
    let token = this.storageService.getUser();
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', '*/*',);

    //httpOptions.headers.set('Authentication', 'Bearer ' + token);
    return this.http.post(
      AUTH_API + 'api/LpuJournal/JournalMasterNew',dataSoft,
     {headers}
    );
  }


  AddJournalUserAccount(newUserData: FormData): Observable<any> {
    let token = this.storageService.getUser();
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authToken)
    return this.http.post(
      // AUTH_API + 'api/LpuJournal/CreateJournalUserAccount', newUserData, { headers }
      //AUTH_API + 'api/LpuJournal/CreateJournalUserAccount', newUserData, { headers }
       AUTH_API_LOCAL + 'api/LpuJournal/CreateJournalUserAccount', newUserData, { headers }
    );
  }


  
  GetAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    .set('Content-Type', 'application/json');
    return this.http.get(   
      AUTH_API + 'api/LpuJournal/GetJournalUserDetailsIdWise?Email=' + UserEmail + '&PasswordText=' + secreatKeys + '&UserRole=' + userRole,
      // AUTH_API_LOCAL + 'api/LpuJournal/GetJournalUserDetailsIdWise?Email=' + UserEmail + '&PasswordText=' + secreatKeys + '&UserRole=' + userRole,
     {headers}
    );
  }

  UpdateJournalImageFile(dataSoft:FormData): Observable<any> {
    let token = this.storageService.getUser();
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', '*/*',);
    //httpOptions.headers.set('Authentication', 'Bearer ' + token);
    return this.http.post(
       AUTH_API + 'api/LpuJournal/UpdateJournalImage',dataSoft,
      // AUTH_API_LOCAL + 'api/LpuJournal/UpdateJournalImage',dataSoft,
     {headers}
    );
  }



  // 24-oct-24
  //NewJournalMenuScript

  
  AddNewJournalMenuScriptData(newMenuScriptData: FormData): Observable<any> {
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    return this.http.post(
      // AUTH_API + 'api/LpuJournal/NewJournalMenuScript', newMenuScriptData, { headers }
      AUTH_API_LOCAL + 'api/LpuJournal/NewJournalMenuScript', newMenuScriptData, { headers }
    );
  }

  //GetAllMenuScriptForUser?Email=devendra.15673%40lpu.co.in
  UserWiseAllMenuScript(UserEmail:any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    return this.http.get(
      // AUTH_API_LOCAL + 'api/LpuJournal/GetAllMenuScriptForUser?Email=' + UserEmail, { headers }
      AUTH_API + 'api/LpuJournal/GetAllMenuScriptForUser?Email=' + UserEmail, { headers }
    );
  }
  GetUserRolesforUser(UserEmail:any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    return this.http.get(
      // AUTH_API_LOCAL + 'api/LpuJournal/GetAllMenuScriptForUser?Email=' + UserEmail, { headers }
      // AUTH_API+ 'api/LpuJournal/GetUserRoles?Email=' + UserEmail, { headers }
      AUTH_API_LOCAL+ 'api/LpuJournal/GetUserRoles?Email=' + UserEmail, { headers }
    );
  }


 AuthoriseUserDetails(UserEmail: any, secreatKeys: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.authToken)
    .set('Content-Type', 'application/json');
    return this.http.get(   
      AUTH_API_LOCAL + 'api/LpuJournal/GetUserDetailsIdWise?Email=' + UserEmail + '&PasswordText=' + secreatKeys ,
      // AUTH_API + 'api/LpuJournal/GetUserDetailsIdWise?Email=' + UserEmail + '&PasswordText=' + secreatKeys ,
     {headers}
    );
  }
}
