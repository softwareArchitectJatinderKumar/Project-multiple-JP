import axios, { AxiosInstance } from 'axios';
import { storageService } from './storageService';
import { Type } from 'lucide-react';

class InstrumentService {
  private apiClient: AxiosInstance;
  public folderUrl: string | undefined;

  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });
    this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
  }

  
  async GetAllBooksDetails() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllJournalData');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  // Method to fetch instruments
  async getAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllInstruments');
      return response.data.item1 || [];
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
 
async GetAllSampleStatus() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllSampleStatus');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
    
  }
  // New API added 

  async GetAuthoriseUserData(formData: FormData) {
    try {
      const res = await this.apiClient.post(`api/LpuCIF/GetUserDataIdWise`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
      return res.data;
      // const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', 
      //   formData,

      // );
      // return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetAnalysisData(analysisId: number | string, typeId: number | string) {
  try {
    const response = await this.apiClient.get('api/LpuCIF/GetAnalysisIdWisePriceDetails',
      {
        params: {
          AnalysisId: analysisId,
          TypeId: typeId, // In Angular, this is passed as this.UserId
        },
      }
    );

    // Return the full data object so the component can access response.item1 
    // to match your Angular logic: if (response.item1 && response.item1.length > 0)
    return response.data; 
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    throw error;
  }
}
// async GetAnalysisData(analysisId: number | string, typeId: number | string) {
//   try {
//     const response = await this.apiClient.get('api/LpuCIF/GetAnalysisIdWisePriceDetails',
//       {
//         params: {
//           AnalysisId: analysisId,
//           TypeId: typeId,
//         },
//       }
//     );

//     return response.data?.item1 || [];
//   } catch (error) {
//     console.error('Error fetching analysis data:', error);
//     throw error;
//   }
// }


  async GetInstrumentsDetails() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetInstrumentsDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetAnalysisDetails(InstrumentId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetInstrumentWiseAnalysisDetails', {
        params: {
          InstrumentId: InstrumentId
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetDuationAndPrice(AnalysisId: any, UserId: any, Duration: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetDuationAndPrice', {
        params: {
          AnalysisId: AnalysisId,
          UserId: UserId,
          Duration: Duration
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async addBookingSlot(newBookingData: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/NewBookingSlot', newBookingData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }

 

  async getSpecifications() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
      });
      return response.data.item1;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async fetchSpecifications() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async CIFGetUserDetails(email: string) {
    try {
      const res = await this.apiClient.get(`api/LpuCIF/CIFGetUserDetails?EmailId=${email}`);
      return res.data.item1 || [];
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }


  async getCharges(id: number) {
    const res = await this.apiClient.get(`api/LpuCIF/GetInstrumentChargesDetails?InstrumentID=${id}`);
    return res.data.item1 || [];
  }

  async GetSampleStatusByUserId(UserEmailId: string) {
    const res = await this.apiClient.get(`api/LpuCIF/GetSampleStatusByUserId?UserId=${UserEmailId}`);
    return res.data.item1 || [];

  }

  async CIFUpdateUserDetails(UpdateUserData: FormData) {
    try {
      // const Token = storageService.getUser();
        const res = await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`, UpdateUserData, {
        headers: {
           'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${Token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error submitting Details:', error);
      throw error;
    }
  }

  async UpdateUserDetails(data: any) {
    try {

      const params = new URLSearchParams();
      Object.keys(data).forEach(key => params.append(key, data[key] || ""));

      const res = await this.apiClient.post(`api/LpuCIF/CIUpdateUserDetails`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return res.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }


  async NewCifFeedback(feedbackData: any) {
     const user = storageService.getUser();
    const token = user?.token; // Adjust based on your user object structure
    try {
      const params = new URLSearchParams();
      Object.keys(feedbackData).forEach(key => {
        params.append(key, feedbackData[key]);
      });

      const res = await this.apiClient.post(`api/LpuCIF/NewFeedback`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
           'Authorization': `Bearer ${token}`
        },
      });
      return res.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
 
async getAuthoriseUserData(formData: FormData) {
    // Note: Do NOT set 'Content-Type' manually when sending FormData, 
    // Axios will set it automatically with the correct boundary.
    const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', formData);
    return response.data;
}
}

export const instrumentService = new InstrumentService();
// import axios, { AxiosInstance } from 'axios';
// import { Instrument, Specification, ChargeDetail } from '../types/instruments';

// class InstrumentService {
//   private apiClient: AxiosInstance;
//   public folderUrl: string | undefined;
//   public localApiUrl: string | undefined;

//   constructor() {
//     this.apiClient = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_AUTH_API,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//       },
//     });

//     this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
//     this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL;
//   }

//   async getAllInstruments(): Promise<Instrument[]> {
//     const response = await this.apiClient.get<{ item1: Instrument[] }>('/GetAllInstrumentsData');
//     return response.data.item1 || [];
//   }

//   async getSpecifications(): Promise<Specification[]> {
//     const response = await this.apiClient.get<{ item1: Specification[] }>('/fetchSpecifications');
//     return response.data.item1 || [];
//   }

//   async getCharges(id: number): Promise<ChargeDetail[]> {
//     const response = await this.apiClient.get<{ item1: ChargeDetail[] }>(`/GetChargesDetails/${id}`);
//     return response.data.item1 || [];
//   }
// }

// export const instrumentService = new InstrumentService();