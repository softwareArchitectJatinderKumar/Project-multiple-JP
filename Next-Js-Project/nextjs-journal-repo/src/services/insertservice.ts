// import axios, { AxiosInstance } from 'axios';
//  import https from 'https';
// class InstrumentService {
//   private apiClient: AxiosInstance;
//   public folderUrl: string | undefined;

//   constructor() {
//     this.apiClient = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_AUTH_API,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//       },
//     });
//     this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
//   }

//   async getAllInstruments() {
//     try {
//       const response = await this.apiClient.get('api/LpuCIF/GetAllInstruments');
//       return response.data.item1; 
//     } catch (error) {
//       console.error('Error fetching authorized user data:', error);
//       throw error; 
//     }
//   }

//   async getSpecifications() {
//   try {
//     const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
//     });
//     return response.data.item1; 
//   } catch (error) {
//     console.error('Error fetching authorized user data:', error);
//     throw error; 
//   } 
// }

//   async fetchSpecifications() {
//   try {
//     const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
//     });
//     return response.data; 
//   } catch (error) {
//     console.error('Error fetching authorized user data:', error);
//     throw error; 
//   } 
// }

//   async CIFGetUserDetails(email: string) {
//     try {
//       const res = await this.apiClient.get(`api/LpuCIF/CIFGetUserDetails?EmailId=${email}`);
//       return res.data.item1 || [];
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       throw error;
//     }
//   }


//   async getCharges(id: number) {
//     const res = await this.apiClient.get(`api/LpuCIF/GetInstrumentChargesDetails?InstrumentID=${id}`);
//     return res.data.item1 || [];
//   }

//   // async  CIFUpdateUserDetails(UpdateUserData: FormData) {
//   //    try {
//   //     const res = await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`, UpdateUserData);
//   //     return res.data;
//   //   } catch (error) {
//   //     console.error('Error submitting Details:', error);
//   //     throw error;
//   //   }
    
//   // }

 
//   async CIFUpdateUserDetails(UpdateUserData: FormData) {
//     const agent = new https.Agent({
//       rejectUnauthorized: false,
//     });
//     let requestBody = {
//       data: UpdateUserData
//     }
//     try {
//       //await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`
//       const response = await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`,
//         requestBody.data,
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//           httpsAgent: agent
//         }

//       )

//       return response.data

//     } catch (error: any) {

//       console.error('Failed to get steps', error);

//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       }

//       const errorMessage = error.response?.data?.message ||
//         error.message ||
//         'Failed to get steps';

//       return {
//         message: errorMessage,
//         status: 'error',
//         error: error.response?.data || error.message
//       };
//     }
//     // try {
//     //   const res = await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`, UpdateUserData, {
//     //     headers: {
//     //       // Setting this to undefined allows the browser/Axios to 
//     //       // automatically set 'multipart/form-data' with the correct boundary.
//     //       'Content-Type': 'multipart/form-data', 
//     //     },
//     //   });
//     //   return res.data;
//     // } catch (error) {
//     //   console.error('Error submitting Details:', error);
//     //   throw error;
//     // }
//   }


//     async UpdateUserDetails(UserData: FormData) {
//       const agent = new https.Agent({
//       rejectUnauthorized: false,
//     });
//     let requestBody = {
//       data: UserData
//     }
//     try {
//       //await this.apiClient.post(`api/LpuCIF/CIFChangePasswordDetails`
//       const response = await this.apiClient.post(`api/LpuCIF/CIUpdateUserDetails`,
//         requestBody.data,
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//           httpsAgent: agent
//         }

//       )

//       return response.data

//     } catch (error: any) {

//       console.error('Failed to get steps', error);

//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       }

//       const errorMessage = error.response?.data?.message ||
//         error.message ||
//         'Failed to get steps';

//       return {
//         message: errorMessage,
//         status: 'error',
//         error: error.response?.data || error.message
//       };
//     }
//     //  try {
//     //   const res = await this.apiClient.post(`api/LpuCIF/CIUpdateUserDetails`, UserData, {
//     //     headers: {
//     //       'Content-Type': 'multipart/form-data', 
//     //     },
//     //   });
//     //   return res.data;
//     // } catch (error) {
//     //   console.error('Error submitting Details:', error);
//     //   throw error;
//     // }
    
//   }

 
// }

// export const instrumentService = new InstrumentService();
// // import axios, { AxiosInstance } from 'axios';
// // import { Instrument, Specification, ChargeDetail } from '../types/instruments';

// // class InstrumentService {
// //   private apiClient: AxiosInstance;
// //   public folderUrl: string | undefined;
// //   public localApiUrl: string | undefined;

// //   constructor() {
// //     this.apiClient = axios.create({
// //       baseURL: process.env.NEXT_PUBLIC_AUTH_API,
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
// //       },
// //     });

// //     this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
// //     this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL;
// //   }

// //   async getAllInstruments(): Promise<Instrument[]> {
// //     const response = await this.apiClient.get<{ item1: Instrument[] }>('/GetAllInstrumentsData');
// //     return response.data.item1 || [];
// //   }

// //   async getSpecifications(): Promise<Specification[]> {
// //     const response = await this.apiClient.get<{ item1: Specification[] }>('/fetchSpecifications');
// //     return response.data.item1 || [];
// //   }

// //   async getCharges(id: number): Promise<ChargeDetail[]> {
// //     const response = await this.apiClient.get<{ item1: ChargeDetail[] }>(`/GetChargesDetails/${id}`);
// //     return response.data.item1 || [];
// //   }
// // }

// // export const instrumentService = new InstrumentService();
// "use server"
// import axios from 'axios';
// import { getServerSession } from "next-auth";
// import { authOptions } from '@/utils/authOptions';
// import https from 'https';
// import urls from "@/app/url";


// export async function InsertPlacementCompanyInformation(formfields: any) {

//     const session = await getServerSession(authOptions);

//     if (!session?.user?.token) {
//         return {
//             message: 'Authentication failed. Please log in again.',
//             status: 'error',
//         };
//     }

//     const agent = new https.Agent({
//         rejectUnauthorized: false,
//     });

//     let requestBody = {
//         data: formfields
//     }


//     try {
//         const response = await axios.post(`${urls.basewebapiurl}/PlacementBridge/InsertPlacementCompanyInformation`,
//             requestBody.data,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${session?.user?.token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 httpsAgent: agent
//             }
        
//         )
 
//         return response.data

//     } catch (error: any) {

//         console.error('Failed to get steps', error);

//         if (error.response) {
//             console.error('Response data:', error.response.data);
//             console.error('Response status:', error.response.status);
//             console.error('Response headers:', error.response.headers);
//         }

//         const errorMessage = error.response?.data?.message ||
//             error.message ||
//             'Failed to get steps';

//         return {
//             message: errorMessage,
//             status: 'error',
//             error: error.response?.data || error.message
//         };
//     }
// }