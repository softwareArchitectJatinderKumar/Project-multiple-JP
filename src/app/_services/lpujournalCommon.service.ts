import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { StorageService } from './storage.service';
// const AUTH_API = 'https://localhost:7125/';//'https://projectsapi.lpu.in/';
// const LOCAL_API_URL = 'https://localhost:7125/';//'https://localhost:7125/';
// const AUTH_API = 'https://projectsapi.lpu.in/';//'https://projectsapi.lpu.in/';
// const LOCAL_API_URL = 'https://projectsapi.lpu.in/';//'https://localhost:44362/'; 
const AUTH_API = 'https://localhost:44362/';//'https://projectsapi.lpu.in/';
const LOCAL_API_URL = 'https://localhost:44362/';//'https://localhost:44362/'; 

@Injectable({
  providedIn: 'root'
})
export class LpujournalCommonService {
  baseUrl = AUTH_API;

  constructor(private http: HttpClient, private storageService: StorageService) { }
 
  JournalGetUserDetails(UserEmailId: string): Observable<any> {
    return this.http.get(
      this.baseUrl + 'api/LpuJournalCommon/JournalGetUserDetails?EmailId=' + UserEmailId,
    );
  }

  JournalUpdatePasswordDetails(UpdateUserData: FormData): Observable<any> {
  
    return this.http.post(
      this.baseUrl + 'api/LpuJournalCommon/JournalUpdatePasswordDetails', UpdateUserData
    );
  }

  GetAllBooksDetails(): Observable<any> {        
    return this.http.get<any>(`${LOCAL_API_URL}api/LpuJournalCommon/GetAllJournalData`);
  }

  GetJournalAuthorDetails(): Observable<any> {    
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetAllJournalMasterwithEditorDetails`);
  }

  //24-sep-24
  GetAllJournalMasterwithEditorDetails(): Observable<any> {  
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetAllJournalMasterwithEditorDetails`);
  }


  GetJournalProperties(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetJournalProperties`);
  }
  
  GetAllJournalEditorsDetails(): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetAllJournalEditorsDetails`);
  }
 
  GetJournalDetailsforAboutPage(JournalId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetJournalDetailsforAboutPage?JournalId=` + JournalId);    
  }

    GetJournalIssues(JournalId: any): Observable<any> {
    return this.http.get<any>(`${LOCAL_API_URL}api/LpuJournalCommon/GetJournalIssuesDetails?JournalId=` + JournalId);
  }

  AddJournalUserAccount(newUserData: FormData): Observable<any> {
    return this.http.post(
      this.baseUrl + 'api/LpuJournalCommon/CreateJournalUserAccount', newUserData,
    );
  }
  GetAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any): Observable<any> {
     return this.http.get(
      this.baseUrl + 'api/LpuJournalCommon/GetJournalUserDetailsIdWise?Email=' + UserEmail + '&PasswordText=' + secreatKeys + '&UserRole=' + userRole,
    );
  }

  AuthoriseUserDetails(loginData: FormData): Observable<any> {
  return this.http.post(
    this.baseUrl + 'api/LpuJournalCommon/GetUserDetailsIdWise',    loginData,   
  );
}

  GetUserRolesforUser(UserEmail: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetUserRoles?Email=` + UserEmail);
  }

  AssignExternalReviewerForJournal(AssignnewReviewer: FormData): Observable<any> {
    return this.http.post(
      this.baseUrl + 'api/LpuJournalCommon/CreateJournalUserAccountForExternalReviewer', AssignnewReviewer
    );
  }

  JournalUpdatePasswordSecure(UpdateUserData: FormData): Observable<any> {    
    return this.http.post(
      this.baseUrl + 'api/LpuJournalCommon/UpdatePasswordWithSecurity', UpdateUserData,       
    );
  }
  GetEditorsDetailsIdWise(Id:any): Observable<any> {   
    return this.http.get(
      this.baseUrl + 'api/LpuJournalCommon/GetEditorsDetails?JournalId='+Id,  
    );
  }


  GetBooksDataWithEditorDetails(): Observable<any> { 
    return this.http.get<any>(`${this.baseUrl}api/LpuJournalCommon/GetBooksDataWithEditorDetails` );
  }



  GetMenuScriptForReviewers(AssignedToUserEmail: any): Observable<any> { 
    return this.http.get(
      this.baseUrl + 'api/LpuJournalCommon/GetAllMenuScriptForReviewers?Email=' + AssignedToUserEmail,  
    );
  }

 

}
