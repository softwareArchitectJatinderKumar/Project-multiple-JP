"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import styles from './JournalInnerMenu.module.css';
import myAppWebService from '@/services/myAppWebService';

const JournalInnerMenu = () => {
  const router = useRouter();
  const params = useParams();
  
  // State
  const [loginStatus, setLoginStatus] = useState(false);
  const [journalIssues, setJournalIssues] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bookId = params?.Id as string;
  const name = params?.name as string;

  useEffect(() => {
    checkUserLogin();
    if (bookId) {
      fetchJournalIssues(bookId);
    }
  }, [bookId]);

  const checkUserLogin = () => {
    const authData = Cookies.get('authData');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 
    setLoginStatus(!!authData && isLoggedIn);
  };

  const fetchJournalIssues = async (id: string) => {
    try {
        const response = await myAppWebService.GetJournalIssues(bookId);
        console.log(JSON.stringify(response)+'journal issues ')
        if (response && response.item1) {
          setJournalIssues(response.item1 || []);
        }
    } catch (error) {
      console.error('Error fetching journal issues', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('authData');
    Cookies.remove('BookData');
    localStorage.clear();
    sessionStorage.clear();
    setLoginStatus(false);

    router.push('/Home');
    // Next.js handles navigation smoothly, but if you need a hard refresh:
    // window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper for dynamic URL generation
  const getPath = (suffix: string) => `/${bookId}/${name}/${suffix}`;

  return (
    <div className={styles.JournalpageCustomNav}>
      <nav>
        <label htmlFor="drop" className={styles.toggle} onClick={toggleMobileMenu}>
          <div className={`${styles.mobileNavIcon} ${isMenuOpen ? styles.change : ''}`}>
            <div className={styles.bar1}></div>
            <div className={styles.bar2}></div>
            <div className={styles.bar3}></div>
          </div>
        </label>
        <input type="checkbox" id="drop" className={styles.dropInput} checked={isMenuOpen} readOnly />
        
        <ul className={styles.menu}>
          {journalIssues.length > 0 && (
            <li className={styles.nextdrop}>
              <Link href={getPath('GetIssues')} className={styles.dropa}>
                Published Issues 
                <span className="position-relative">
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {journalIssues.length}
                  </span>
                </span>
              </Link>
            </li>
          )}

          <li><Link href={getPath('About')}>About</Link></li>
          <li><Link href={getPath('EditorialBoard')}>Editorial Board</Link></li>

          <li className={styles.nextdrop}>
            <label htmlFor="drop-1" className={styles.toggle}>Author Guidelines</label>
            <a className={styles.dropa}>
              Author Guidelines 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill ms-1" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </a>
            <input type="checkbox" id="drop-1" className={styles.dropInput} />
            <ul>
              <li><Link href={getPath('AuthorGuidelines/ManuScriptPrepare')}>Manuscript Preparation</Link></li>
              <li><Link href={getPath('AuthorGuidelines/ManuScriptWorkFlow')}>Manuscript Workflow</Link></li>
            </ul>
          </li>

          <li className={styles.nextdrop}>
            <label htmlFor="drop-2" className={styles.toggle}>Policies</label>
            <a className={styles.dropa}>
              Policies 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill ms-1" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </a>
            <input type="checkbox" id="drop-2" className={styles.dropInput} />
            <ul>
              <li><Link href={getPath('Policies/EditorialPolicy')}>Editorial Policy</Link></li>
              <li><Link href={getPath('Policies/PeerReviewPolicy')}>Peer Review Policy</Link></li>
              <li><Link href={getPath('Policies/OpenAccessPolicy')}>Open Access Policy</Link></li>
              <li><Link href={getPath('Policies/PlagiarismPolicy')}>Plagiarism Policy</Link></li>
              {/* Add other policy links here... */}
            </ul>
          </li>

          {loginStatus ? (
            <>
              <li className={styles.nextdrop}>
                <a className={styles.dropa}>Manuscript</a>
                <ul>
                  <li><Link href={getPath('SubmitManuScript')}>Dashboard</Link></li>
                  <li><Link href={getPath('MyManuScript')}>My Requests</Link></li>
                </ul>
              </li>
              <li className={styles.nextdrop}>
                <a className={styles.dropa}>Account Settings</a>
                <ul>
                  <li><Link href={getPath('RecoverPasswordReset')}>Change Password</Link></li>
                  <li><a onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</a></li>
                </ul>
              </li>
            </>
          ) : (
            <li><Link href={getPath('ExternalLogin')}>Login</Link></li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default JournalInnerMenu;