"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Home.module.css';
import myAppWebService from '@/services/myAppWebService';
import JournalCarousel from '@/component/journalCarousel/JournalCarousel';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalPopularByGenre from '@/component/journalPopularByGenre/JournalPopularByGenre';
 
 
export default function JournalHome() {
  const [serverConnection, setServerConnection] = useState<number | null>(null);
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getBooksDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await myAppWebService.GetAllBooksDetails();
      
      if (response && response.item1 && response.item1.length > 0) {
        setServerConnection(1);
        setServerError(false);
      } else {
        setServerConnection(0);
        setServerError(true);
      }
    } catch (error) {
      console.error('Server error:', error);
      setServerConnection(0);
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getBooksDetail();
  }, [getBooksDetail]);

  const retryConnection = () => {
    setServerError(false);
    getBooksDetail();
  };

  // Logic to show error if connection failed or explicitly errored
  const isHealthy = serverConnection === 1 && !serverError;

  return (
    <div id="HomeComponent">
      <JournalMenuBar />

      {isLoading ? (
        <div className="text-center p-5">Loading Journals...</div>
      ) : isHealthy ? (
        <>
          <JournalCarousel />
          <JournalPopularByGenre />
        </>
      ) : (
        /* Error Connection UI */
        <div className={styles.serverErrorContainer}>
          <div className={styles.serverErrorContent}>
            <div className={styles.errorIconWrapper}>
              <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
            
            <h1 className={styles.errorTitle}>Our Journals are Temporarily Unavailable</h1>
            <p className="fs-5 fw-bolder">We're experiencing technical difficulties. Our team is working to resolve the issue. Please try again later.</p>
            
            <div className={styles.errorDetails}>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>What's Happening?</h3>
                <ul>
                  <li>Scheduled maintenance in progress</li>
                  <li>Server connectivity issues</li>
                  <li>System updates being applied</li>
                </ul>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>What Can You Do?</h3>
                <ul>
                  <li>Wait a few minutes and refresh</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if issue persists</li>
                </ul>
              </div>
            </div>

            <button className={styles.retryButton} onClick={retryConnection}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9.00001C19.9828 7.56679 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4745 3.55978 13.9917 3.22427C12.5089 2.88877 10.9652 2.93436 9.50481 3.35679C8.04437 3.77922 6.71475 4.56473 5.64 5.64001L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7758C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}