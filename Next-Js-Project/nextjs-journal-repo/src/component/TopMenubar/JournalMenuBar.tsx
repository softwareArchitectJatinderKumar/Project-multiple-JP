"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './JournalMenuBar.module.css'; // Import Styles

const JournalMenuBar = () => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isDisabled] = useState(true);

  const toggleSearchForm = () => setShowSearchForm(!showSearchForm);

  return (
    <header className={styles.header}>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg p-0">
          <Link href="/" className="navbar-brand mx-0">
            <img src="/assets/images/logo/logo.svg" alt="Logo" />
          </Link>

          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            {!showSearchForm && (


              <ul className="navbar-nav mb-2 mb-lg-0">
                {/* Apply navItemNotLast logic to all except last item */}
                <li className={`${styles.navItemNotLast} nav-item`}>
                  <Link href="/" className={`${styles.navLink} `}>Home</Link>
                </li>
                <li className={`${styles.navItemNotLast} nav-item`}>
                  <a href="https://www.lpu.in/academics/research.php" className={`${styles.navLink} `} target="_blank" rel="noopener noreferrer">Research</a>
                </li>
                <li className={`${styles.navItemNotLast} nav-item`}>
                  <a className={`${styles.navLink} `} href="https://conferences.lpu.in/?_gl=1*19uo6zf*_gcl_au*MTQyMzk3NTE0LjE3MjQxMjQ4Mjk." target="_blank" rel="noopener noreferrer">
                    CONFERENCES
                  </a>
                </li>
                  <li className={`${styles.navItemNotLast} nav-item`}>
                  <Link href="/" className={`${styles.navLink} `}>CONTACT US</Link>
                </li>
                {/* <li className={`${styles.navItemNotLast} nav-link`}><Link href="/" className={`${styles.navLink} nav-link`} >CONTACT US</Link></li> */}
                <li className={`${styles.navLink + ' ' + styles.srchIcon}`}>
                  <button  
                    className={`${styles.navLink}  btn btn-sm`}
                    onClick={toggleSearchForm}
                    disabled={isDisabled}
                    style={{ color: isDisabled ? 'gray' : 'inherit' , padding: 0, margin: 0}}
                  >
                    <img src="/assets/images/icon/search-icon.svg" alt="search" /> SEARCH
                  </button>
                </li>
              </ul>
            )}

            {/* Requirement #5: Search Form Overlay */}
            {showSearchForm && (
              <div className={styles.searchForm}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Type & Hit Enter.."
                  autoFocus
                />
                <button className={styles.searchSubmit} onClick={toggleSearchForm}>
                  <img src="/assets/images/icon/search-close.svg" alt="close" />
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default JournalMenuBar;