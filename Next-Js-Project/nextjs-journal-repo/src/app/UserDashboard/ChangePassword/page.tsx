"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import swal from 'sweetalert2';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';
import ChangePasswordUI from './ChangePasswordUI';

// Combined Validation Schema
const changePasswordSchema = z.object({
  idProofNumber: z.string().min(1, "ID Proof Number is required."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string().min(1, "Confirm Password is required."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ChangePasswordPage() {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null);
  const [idProofType, setIdProofType] = useState('Mobile Number');
  const [serverStoredIdNumber, setServerStoredIdNumber] = useState('');

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange"
  });

  const BookId = params.Id;
  const name = params.name;

  useEffect(() => {
    loadAndCheckEmail();
  }, []);

  // Step 1: Logic from Angular's checkEmail()
  const loadAndCheckEmail = async () => {
    const cookieData = Cookies.get('authData');
    if (!cookieData) {
      router.push(`/${BookId}/${name}/ExternalLogin`);
      return;
    }

    const parsedData = JSON.parse(cookieData);
    try {
      const response = await myAppWebService.JournalGetUserDetails(parsedData.EmailId);
      if (response.item1 && response.item1.length > 0) {
        setUserDetails(response.item1[0]);
        setServerStoredIdNumber(response.item1[0].mobileNumber);
        // We stay at currentStep 1 as per your Angular logic: this.currentStep=1;
      } else {
        setErrorMessage('No user found or account is locked');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching the user details');
    }
  };

  // Step 1 Action: verifyIdProof()
  const handleVerifyId = () => {
    const entered = getValues('idProofNumber');
    if (entered === serverStoredIdNumber) {
      setErrorMessage('');
      setCurrentStep(2);
    } else {
      setErrorMessage('ID Proof number does not match');
    }
  };

  // Step 2 Action: resetPassword()
  const onFinalSubmit = async (data: any) => {
    const cookieData = Cookies.get('authData');
    const userEmail = JSON.parse(cookieData || '{}').EmailId;

    try {
      const formData = new FormData();
      formData.append('UserId', userEmail);
      formData.append('Password', data.password);

      const res = await myAppWebService.JournalUpdatePasswordDetails(formData);
      const result = res.item1[0]['msg'];

      if (result === 'Success') {
        swal.fire({
          title: 'Details Updated Successfully!',
          text: 'You will be logged out',
          icon: 'success'
        }).then(() => {
          router.push(`/${BookId}/${name}/ExternalLogin`);
        });
      } else {
        swal.fire('Error', 'Unable to Update Details', 'error').then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      swal.fire('Error', 'Failed to Update.', 'error');
    }
  };

  return (
    <ChangePasswordUI 
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      register={register}
      errors={errors}
      errorMessage={errorMessage}
      idProofType={idProofType}
      handleVerifyId={handleVerifyId}
      onFinalSubmit={handleSubmit(onFinalSubmit)}
    />
  );
}