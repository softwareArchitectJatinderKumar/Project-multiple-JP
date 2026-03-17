"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import swal from 'sweetalert2';
import myAppWebService from '@/services/myAppWebService';
import ForgotPasswordUI from './ForgotPasswordUI';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';

// Validation Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  consent: z.boolean().refine(val => val === true, "Consent is required")
});

export default function ForgotPasswordPage() {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  const BookId = params.Id;
  const name = params.name;
  const journalTitle = typeof name === 'string' ? name.replace(/-/g, ' ') : '';

  const { register, handleSubmit, getValues, resetField, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: '', consent: false }
  });

  // Step 1: Check Email
  const checkEmail = async () => {
    setErrorMessage('');
    const email = getValues('email');

    try {
      const response = await myAppWebService.JournalGetUserDetails(email);
      if (response?.item1?.length > 0) {
        const user = response.item1[0];
        if (user.mobileNumber?.length > 0) {
          setVerifiedEmail(email);
          setCurrentStep(2);
        } else {
          showUserNotFound();
        }
      } else {
        showUserNotFound();
      }
    } catch (error) {
      showUserNotFound();
    }
  };

  const showUserNotFound = () => {
    const msg = 'No user found or account is locked';
    setErrorMessage(msg);
    swal.fire({ title: msg, icon: 'error' }).then(() => {
      resetField('email');
      setCurrentStep(1);
    });
  };

  // Step 2: Reset Password Logic
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const onResetSubmit = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    const newPassword = generateRandomPassword();

    try {
      const formData = new FormData();
      formData.append('UserId', verifiedEmail);
      formData.append('Password', newPassword);

      const response = await myAppWebService.JournalUpdatePasswordDetails(formData);
      const result = response.item1[0]?.msg;

      // Handle loading delay (min 1.5s)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1500 - elapsed, 0);
      
      setTimeout(() => {
        setIsLoading(false);
        if (result === 'Success') {
          swal.fire({
            title: 'Password is reset, Check Email!',
            icon: 'success'
          }).then(() => {
            router.push(`/${BookId}/${name}/ExternalLogin`);
          });
        } else {
          swal.fire('Error', 'Unable to Update Details.', 'error').then(() => window.location.reload());
        }
      }, remaining);

    } catch (error) {
      setIsLoading(false);
      swal.fire('Error', 'Failed to Update.', 'error').then(() => window.location.reload());
    }
  };

  return (
        <>
      <JournalMenuBar />
      <JournalInnerMenu />
    <ForgotPasswordUI 
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      isLoading={isLoading}
      register={register}
      errors={errors}
      errorMessage={errorMessage}
      checkEmail={checkEmail}
      onResetSubmit={onResetSubmit}
      BookId={BookId}
      name={name}
      journalTitle={journalTitle}
    />
    </>
  );
}