"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import swal from 'sweetalert2';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';
import SecurePasswordUI from './SecurePasswordUI';

const passwordSchema = z.object({
  emailId: z.string().optional(),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  newPassword: z.string().min(8, "Minimum 8 characters required"),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export default function SecurePasswordChangePage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const BookId = params.Id;
  const name = params.name;

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit", // Only validate on explicit submit
  });

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    const cookieData = Cookies.get('authData');
    if (!cookieData) {
      swal.fire('Login Error', 'Try Again', 'error').then(() => {
        router.push(`/${BookId}/${name}/ExternalLogin`);
      });
      return;
    }
    const parsedData = JSON.parse(cookieData);
    try {
      const data = await myAppWebService.JournalGetUserDetails(parsedData.EmailId);
      const user = data.item1[0];
      setUserDetails(user);
      setValue('emailId', user.emailId);
    } catch (error) {
      setErrorMessage('Unable to load user details.');
    }
  };

  const verifyIdentity = () => {
    const enteredMobile = getValues('mobileNumber');
    if (!enteredMobile) {
      setErrorMessage('Please enter your registered mobile number.');
      return;
    }

    setIsVerifying(true);
    if (enteredMobile === userDetails?.mobileNumber) {
      setIsVerified(true);
      setIsVerifying(false);
      setSuccessMessage('Mobile number verified successfully!');
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setIsVerifying(false);
      setErrorMessage('Mobile number does not match our records.');
    }
  };

  const onActualSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Using 'UserId' to match your Angular formData.append('UserId', this.userEmail)
      formData.append('UserId', userDetails.emailId);
      formData.append('Password', data.newPassword);

      const res = await myAppWebService.JournalUpdatePasswordSecure(formData);
      const result = res.item1[0]?.msg;

      if (result === 'Success') {
        swal.fire('Updated!', 'Password Updated Successfully!', 'success').then(() => {
          router.push(`/${BookId}/${name}/ExternalLogin`);
        });
      } else {
        swal.fire('Error', 'Unable to Update Details', 'error').then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      swal.fire('Error', 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SecurePasswordUI 
      register={register}
      // CRITICAL FIX: handle the submit and log errors if it fails
      onSubmit={handleSubmit(onActualSubmit, (err) => console.log("Form Validation Failed:", err))}
      errors={errors}
      isVerified={isVerified}
      isVerifying={isVerifying}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      successMessage={successMessage}
      userDetails={userDetails}
      verifyIdentity={verifyIdentity}
    />
  );
}


// "use client";

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import swal from 'sweetalert2';
// import Cookies from 'js-cookie';

// import myAppWebService from '@/services/myAppWebService';
// import SecurePasswordUI from './SecurePasswordUI';

// // Validation Schema
// const passwordSchema = z.object({
//   mobileNumber: z.string().min(10, "Enter a valid 10-digit number").max(10),
//   newPassword: z.string().min(8, "Minimum 8 characters required."),
//   confirmNewPassword: z.string()
// }).refine((data) => data.newPassword === data.confirmNewPassword, {
//   message: "Passwords do not match",
//   path: ["confirmNewPassword"],
// });

// export default function SecurePasswordChangePage() {
//   const params = useParams();
//   const router = useRouter();

//   // State Variables
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//     const passwordSchema = z.object({
//         emailId: z.string().optional(), // Add this line
//         mobileNumber: z.string().min(10, "Enter a valid 10-digit number").max(10),
//         newPassword: z.string().min(8, "Minimum 8 characters required."),
//         confirmNewPassword: z.string()
//     }).refine((data) => data.newPassword === data.confirmNewPassword, {
//         message: "Passwords do not match",
//         path: ["confirmNewPassword"],
//     });

    
//   const BookId = params.Id;
//   const name = params.name;
//   const JournalTitle = String(name).replace(/-/g, ' ');

//   const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm({
//     resolver: zodResolver(passwordSchema),
//     mode: "onChange"
//   });


  
//   useEffect(() => {
//     loadUserDetails();
//   }, []);

//   const loadUserDetails = async () => {
//     const cookieData = Cookies.get('authData');
//     if (!cookieData) {
//       swal.fire('Login Error', 'Try Again', 'error').then(() => {
//         router.push(`/${BookId}/${name}/ExternalLogin`);
//       });
//       return;
//     }

//     const parsedData = JSON.parse(cookieData);
//     try {
//       // Angular: this.lpuWebServices.JournalGetUserDetails(this.userEmail)
//       const data = await myAppWebService.JournalGetUserDetails(parsedData.EmailId);
//       const user = data.item1[0];
//       setUserDetails(user);
//       setValue('emailId', user.emailId); // Patch value
//     } catch (error) {
//       setErrorMessage('Unable to load user details. Please log in again.');
//       router.push('/Login');
//     }
//   };

 
//   const verifyIdentity = () => {
//   // 1. Get value and trim whitespace to prevent accidental mismatch
//   const enteredMobile = getValues('mobileNumber')?.trim();

//   if (!enteredMobile) {
//     setErrorMessage('Please enter your registered mobile number.');
//     return;
//   }

//   setIsVerifying(true);
//   setErrorMessage(null);

//   // 2. Exact match check (ensure both are strings)
//   if (String(enteredMobile) === String(userDetails?.mobileNumber)) {
//     setIsVerified(true);
//     setIsVerifying(false);
    
//     // 3. Clear any existing error messages
//     setErrorMessage(null); 
//     setSuccessMessage('Mobile number verified successfully!');
    
//     // Optional: If you want to mimic Angular's .disable(), 
//     // you'd pass the 'disabled' prop to the input in the UI 
//     // based on the isVerified state.
    
//     setTimeout(() => setSuccessMessage(null), 3000);
//   } else {
//     setIsVerifying(false);
//     // 4. Force a UI update for the error message
//     setErrorMessage('Mobile number does not match our records.');
//     setSuccessMessage(null);
//   }
// };
// //   const verifyIdentity = () => {
// //     const enteredMobile = getValues('mobileNumber');
// //     if (!enteredMobile) {
// //       setErrorMessage('Please enter your registered mobile number.');
// //       return;
// //     }

// //     setIsVerifying(true);
// //     setErrorMessage(null);

// //     // Angular logic: enteredMobile === this.userDetails.mobileNumber
// //     if (enteredMobile === userDetails?.mobileNumber) {
// //       setIsVerified(true);
// //       setIsVerifying(false);
// //       setSuccessMessage('Mobile number verified successfully!');
// //       setTimeout(() => setSuccessMessage(null), 3000);
// //     } else {
// //       setIsVerifying(false);
// //       setErrorMessage('Mobile number does not match our records.');
// //     }
// //   };

//   const onSubmit = async (data: any) => {
//     if (!isVerified || isSubmitting) return;

//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append('UserId', userDetails.emailId);
//       formData.append('Password', data.newPassword);

//       const res = await myAppWebService.JournalUpdatePasswordSecure(formData);
//       const result = res.item1[0]['msg'];

//       if (result === 'Success') {
//         swal.fire('Details Updated!', 'You will be logged out', 'success').then(() => {
//           router.push(`/${BookId}/${name}/ExternalLogin`);
//         });
//       } else {
//         swal.fire('Update Failed', 'Try again later', 'error').then(() => {
//           window.location.reload();
//         });
//       }
//     } catch (error) {
//       swal.fire('Error', 'Failed to update password.', 'error').then(() => {
//         window.location.reload();
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//   <SecurePasswordUI 
//     register={register}
//    onSubmit={handleSubmit(onSubmit)}
//     errors={errors}
//     isVerified={isVerified}
//     isVerifying={isVerifying}
//     isSubmitting={isSubmitting}
//     errorMessage={errorMessage}
//     successMessage={successMessage}
//     userDetails={userDetails}
//     verifyIdentity={verifyIdentity}
//     JournalTitle={JournalTitle}
//   />
// );
// //   return (
// //     <SecurePasswordUI 
// //       register={register}
// //       handleSubmit={handleSubmit(
// //     (data) => onSubmit(data), 
// //     (err) => console.log("Validation Errors:", err) // This will tell you WHY the button "isn't working"
// //   )}
// //     //   handleSubmit={handleSubmit((data) => onSubmit(data), (errors) => console.log("Form Errors:", errors))}
// //       onSubmit={onSubmit}
// //       errors={errors}
// //       isVerified={isVerified}
// //       isVerifying={isVerifying}
// //       isSubmitting={isSubmitting}
// //       errorMessage={errorMessage}
// //       successMessage={successMessage}
// //       userDetails={userDetails}
// //       verifyIdentity={verifyIdentity}
// //       JournalTitle={JournalTitle}
// //     />
// //   );
// }