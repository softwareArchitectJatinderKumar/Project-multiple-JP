// services/myAppWebService.js
import { storageService } from './storageService';
import axios from 'axios';

class MyAppWebService {
  apiClient: any;
  folderUrl: any
  localApiUrl: any;
  USER_KEY: any;



  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    // Add response interceptor to handle API errors
    this.apiClient.interceptors.response.use(
      (response: any) => {
        // Check if the response indicates an error (common patterns)
        const data = response.data;

        // Check for common error indicators in the response
        if (data && typeof data === 'object') {
          if (data.success === false || data.isError === true || data.error === true) {
            const errorMessage = data.message || data.errorMessage || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
          }
        }

        return response;
      },
      (error: any) => {
        // Handle axios errors (network errors, HTTP errors, etc.)
        let errorMessage = 'An error occurred';

        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;

          if (data && data.message) {
            errorMessage = data.message;
          } else if (status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else if (status === 403) {
            errorMessage = 'Access denied.';
          } else if (status === 404) {
            errorMessage = 'Resource not found.';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Error: ${status}`;
          }
        } else if (error.request) {
          // Request made but no response received
          errorMessage = 'Network error. Please check your connection.';
        } else {
          // Error in setting up the request
          errorMessage = error.message || 'An error occurred';
        }

        return Promise.reject(new Error(errorMessage));
      }
    );


    this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL; // Use the folder URL from env
    this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL; // Use the local API URL from env
    this.USER_KEY = 'auth-user';
  }

  getFolderUrl() {
    return this.folderUrl;
  }

  clean(): void {
    window.sessionStorage.clear();
  }
  public saveUser(user: any): void {
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }


  async loginInternalUser(userId: string, key: string) {

    try {
      const loginData = new FormData();
      loginData.append('userName', userId);
      loginData.append('password', key);

      const response = await this.apiClient.post('security/createtoken', loginData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetEmployeeDetails() {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.get('api/Mou/GetEmployeeDetails', {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  ///api/LpuCIFBridge/GetAllApprovedUserData
  async getStudentById(regNo: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetStudentById', {
        params: {
          RegNo: regNo
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async getAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any) {
    try {
      const loginData = new FormData();
      loginData.append('Email', UserEmail);
      loginData.append('PasswordText', secreatKeys);
      loginData.append('UserRole', userRole);
      const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', loginData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetAllBooksDetails() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllJournalData');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetAllJournalMasterwithEditorDetails() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllJournalMasterwithEditorDetails');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  async GetAllJournalEditorsDetails() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllJournalEditorsDetails');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  async GetJournalDetailsforAboutPage(JournalId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetJournalDetailsforAboutPage?JournalId=' + JournalId);
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  async GetJournalIssues(JournalId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetJournalIssuesDetails?JournalId=' + JournalId);
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }




  async AuthoriseUserDetails(loginData: FormData) {
    //GetJournalUserDetailsIdWise
    try {
      const response = await this.apiClient.post('api/LpuJournal/GetUserDetailsIdWise', loginData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async JournalGetUserDetails(UserEmailId: string) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/JournalGetUserDetails?EmailId=' + UserEmailId);
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async JournalUpdatePasswordSecure(UpdateUserData: FormData) {
    try {
      const response = await this.apiClient.post('api/LpuJournal/UpdatePasswordWithSecurity', UpdateUserData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async JournalUpdatePasswordDetails(UpdateUserData: FormData) {
    try {
      const response = await this.apiClient.post('api/LpuJournal/JournalUpdatePasswordDetails', UpdateUserData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetEditorsDetailsIdWise(Id: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetEditorsDetails?JournalId=' + Id);
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async UpdateEditorDetails(UpdateData: FormData) {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.post('api/LpuJournal/UpdateEditorDetails', UpdateData, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  async AddEditorDetails(UpdateData: FormData) {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.post('api/LpuJournal/InsertNewEditorDetails', UpdateData, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }

  }
  async DeleteEditorDetails(UpdateData: FormData) {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.post('api/LpuJournal/DeleteEditorDetails', UpdateData, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }

  }

  async ManuscriptCrudOperations(formData: FormData) {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.post('api/LpuJournal/JournalManuScriptMasterCrudOperation', formData, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }

  }

  async GetAllJournalUserDetails(RoleId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllJournalUserDetails?Role=' + RoleId);
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }

  }


  async ApproveEditor(dataSoft: FormData) {
    const Token = this.getUser();
    try {
      const response = await this.apiClient.post('api/LpuJournal/ApproveEditor', dataSoft, {
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }


  }

}

const myAppWebService = new MyAppWebService();
export default myAppWebService;

