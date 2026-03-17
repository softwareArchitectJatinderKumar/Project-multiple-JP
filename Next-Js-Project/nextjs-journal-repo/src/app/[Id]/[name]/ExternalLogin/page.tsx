"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import swal from 'sweetalert2';
import Cookies from 'js-cookie';

import { ExternalLoginForm } from './ExternalLoginForm';
import myAppWebService from '@/services/myAppWebService';
import { authService } from '@/services/authService';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';

 
const loginSchema = z.object({
  Email: z.string().email("Enter a valid email address").min(1, "Email is required."),
  Password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function ExternalLoginPage() {
  const params = useParams();
  const router = useRouter();

  // Exact State Variables from Angular
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const BookId = params.Id;
  const name = params.name;
  const JournalTitle = String(name).replace(/-/g, ' ');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ngOnInit
  useEffect(() => {
    setErrorMessage('');
    Cookies.remove('authData');
    localStorage.clear(); 
  }, []);

  // OnSubmit()
  const OnSubmit = (data: any) => {
    setSubmitted(true);        
    AuthoriseUserNewWay(data.Email, data.Password);
  };

  // AuthoriseUserNewWay Logic
  const AuthoriseUserNewWay = async (Id: any, Key: any) => {
    setIsLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 1500;
    let loginError: string | null = null;

    try {
      const fd = new FormData();
      fd.append('Email', Id);
      fd.append('PasswordText', Key);
      const numericJournalId = parseInt(BookId as string, 10);
    
    if (!isNaN(numericJournalId)) {
        fd.append('JournalId', numericJournalId.toString()); 
    }
      // Correct way to log FormData
fd.forEach((value, key) => {
  console.log(key + ': ' + value);
});
      const response = await myAppWebService.AuthoriseUserDetails(fd);
      console.log(JSON.stringify(response)+ ' dafaf a34234 ')
      const userDetails = response?.item1;
      if (userDetails && userDetails.length > 0) {
        const user = userDetails[0];
        if (user.userId > 0) {
          await CreateToken(user.email, response);
        } else {
          loginError = 'Invalid User Details.';
        }
      } else {
        loginError = 'Invalid User Details.';
      }
    } catch (err) {
      loginError = 'Unauthorised Access.';
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(minLoadingTime - elapsed, 0);
      
      setTimeout(() => {
        setIsLoading(false);
        if (loginError) {
          handleLoginFailure(loginError);
        }
      }, remaining);
      reset({ Password: '' }); 
    }
  };

  // CreateToken Logic
  const CreateToken = async (Id: any, response: any) => {
    try {
      const data = await authService.LoginJournalAccessTemp(Id);
      localStorage.setItem('user', JSON.stringify(data)); 
      SetUserData(response);
    } catch (err) {
      setLoadingIndicator(false);
    }
  };

  // SetUserData Logic
  const SetUserData = (response: any) => {
    setLoadingIndicator(true);
    const user = response.item1[0];

    const userCookiesData = {
      CandidateName: user.candidateName,
      AccessToken: user.email,
      Department: user.department,
      DepartmentName: user.departmentName,
      Designation: user.designation,
      EmailId: user.emailId,
      MobileNo: user.mobileNumber,
      UserRole: user.userRole,
      SupervisorName: user.supervisorName,
      ProofNumber: window.btoa(user.idProofNumber || ''), 
      ProofName: user.idProofType,
    };

    Cookies.set('authData', JSON.stringify(userCookiesData));
    setLoadingIndicator(false);

    const passwordchanged = user['isPasswordUpdated'];
    
    if (passwordchanged !== true) {
      VisitUrl('SecurityIssue');
    } else {
      VisitUrl('SubmitManuScript');
    }
  };

  const handleLoginFailure = (message: string) => {
    setErrorMessage(message);
    swal.fire({
      title: message,
      text: 'Check if you have selected the same Journal!',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        VisitUrl('ExternalLogin');
      }
    });
  };

  const VisitUrl = (Suffix: string) => {
    router.push(`/${BookId}/${name}/${Suffix}`);
  };

  return (
    <div style={{backgroundColor: '#FDFFF7 !important'}}>
      <JournalMenuBar />
      <JournalInnerMenu />
      <ExternalLoginForm
        register={register}
        handleSubmit={handleSubmit}
        OnSubmit={OnSubmit}
        errors={errors}
        JournalTitle={JournalTitle}
        showPassword={showPassword}
        togglePasswordVisibility={() => setShowPassword(!showPassword)}
        errorMessage={errorMessage}
        isLoading={isLoading}
        loadingIndicator={loadingIndicator}
        submitted={submitted}
        VisitUrl={VisitUrl}
        BookId={BookId}
        name={name}
      />
    </div>
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
// import { ExternalLoginForm } from './ExternalLoginForm';
// // import { lpuWebServices, authService } from '@/services/lpuWebServices';
// import myAppWebService from '@/services/myAppWebService';
// import { authService } from '@/services/authService';

// const loginSchema = z.object({
//     Email: z.string().email("Enter a valid email address").min(1, "Required"),
//     Password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function LoginPage() {
//     const params = useParams();
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');

//     const { register, handleSubmit, formState: { errors }, reset } = useForm({
//         resolver: zodResolver(loginSchema)
//     });

//     // ngOnInit behavior
//     useEffect(() => {
//         Cookies.remove('authData');
//         localStorage.clear();
//     }, []);

//     const onVisit = (suffix: string) => {
//         router.push(`/${params.Id}/${params.name}/${suffix}`);
//     };

//     const handleLogin = async (data: any) => {
//         setIsLoading(true);
//         const startTime = Date.now();
//         let loginError = null;

//         try {
//             const fd = new FormData();
//             fd.append('Email', data.Email);
//             fd.append('PasswordText', data.Password);
//             fd.append('JournalId', params.Id as string);

//             const response = await myAppWebService.AuthoriseUserDetails(fd);
//             const user = response?.item1?.[0];

//             if (user && user.userId > 0) {
//                 // authService.LoginJournalAccessTemp call
//                 const tokenData = await authService.LoginJournalAccessTemp(user.email);
//                 localStorage.setItem('user', JSON.stringify(tokenData));

//                 // Cookie and Base64 logic exactly like Angular btoa()
//                 const userCookiesData = {
//                     CandidateName: user.candidateName,
//                     AccessToken: user.email,
//                     Department: user.department,
//                     DepartmentName: user.departmentName,
//                     Designation: user.designation,
//                     EmailId: user.emailId,
//                     MobileNo: user.mobileNumber,
//                     UserRole: user.userRole,
//                     SupervisorName: user.supervisorName,
//                     ProofNumber: window.btoa(user.idProofNumber || ''),
//                     ProofName: user.idProofType,
//                 };

//                 Cookies.set('authData', JSON.stringify(userCookiesData));

//                 // Manage minLoadingTime (1500ms)
//                 const elapsed = Date.now() - startTime;
//                 await new Promise(r => setTimeout(r, Math.max(1500 - elapsed, 0)));

//                 setIsLoading(false);
//                 if (user.isPasswordUpdated !== true) {
//                     onVisit('SecurityIssue');
//                 } else {
//                     onVisit('SubmitManuScript');
//                 }
//             } else {
//                 throw new Error('Invalid User Details.');
//             }
//         } catch (err: any) {
//             const elapsed = Date.now() - startTime;
//             await new Promise(r => setTimeout(r, Math.max(1500 - elapsed, 0)));
//             setIsLoading(false);
//             setErrorMessage(err.message || "Unauthorised Access.");
//             swal.fire({ title: 'Login Failed', text: 'Login details are Invalid!', icon: 'warning' });
//         } finally {
//             reset({ Password: '' });
//         }
//     };

//     return (
//         <ExternalLoginForm 
//             register={register}
//             handleSubmit={handleSubmit}
//             onSubmit={handleLogin}
//             errors={errors}
//             journalTitle={String(params.name).replace(/-/g, ' ')}
//             showPassword={showPassword}
//             togglePassword={() => setShowPassword(!showPassword)}
//             errorMessage={errorMessage}
//             isLoading={isLoading}
//             onVisit={onVisit}
//         />
//     );
// }