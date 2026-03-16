
"use client";

import React, { useState, useEffect } from 'react';
import styles from './JournalPopularByGenre.module.css';
const SERVER_URL = 'https://files.lpu.in/umsweb/Journal/';
import myAppWebService from '@/services/myAppWebService';
const JournalPopularByGenre = () => {
  const [booksData, setBooksData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {        
         const response = await myAppWebService.GetAllJournalMasterwithEditorDetails();
          if (response && response.item1) {
          setBooksData(response.item1);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(booksData.length / recordsPerPage);

  const getRecordsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return booksData.slice(startIndex, startIndex + recordsPerPage);
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageRange = () => {
    const visiblePages = 5;
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + visiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section>
      <div className="container popular-genre-section">
        <div className={styles.popularGenre}>
          <div className={styles.title}>
            <h3>Popular by Genre</h3>
          </div>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="journals-tab" data-bs-toggle="tab" data-bs-target="#journals" role="tab">
                Journals<span></span>
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="journals" role="tabpanel">
            <div className="row">

              
              {getRecordsForCurrentPage().map((dataRow, i) => {
                const globalIndex = (currentPage - 1) * recordsPerPage + i;
                const hasError = imageErrors[globalIndex];
                const uniqueKey = `${dataRow.id}-${i}`;
                return (
                  <div className="col-md-4" key={uniqueKey} >
                    <div className={styles.popularGenreContent}>
                      <div className={styles.popularGenreImg}>
                        {!hasError ? (
                          <img
                            src={`${SERVER_URL}${dataRow.imageUrl}`}
                            alt={dataRow.journalTitle}
                            onError={() => handleImageError(globalIndex)}
                            height="220"
                            width="200"
                            className={styles.imgFluid}
                          />
                        ) : (
                          <p className={styles.errorMessage}>Error loading image</p>
                        )}
                      </div>
                      <p className={styles.popularGenreDesc}>
                        {dataRow.journalTitle} {dataRow.genres}
                      </p>
                      <p className={styles.popularGenreAuthor}>{dataRow.editorName}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3">
              <div className={styles.paginationContainer}>
                <ul className={styles.pagination}>
                  <li 
                    className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => changePage(currentPage - 1)}
                  >
                    <span className={styles.pageLink}>&lt;</span>
                  </li>

                  {getPageRange().map(page => (
                    <li 
                      key={page}
                      className={`${styles.pageItem} ${page === currentPage ? styles.active : ''}`}
                      onClick={() => changePage(page)}
                    >
                      <span className={styles.pageLink}>{page}</span>
                    </li>
                  ))}

                  <li 
                    className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}
                    onClick={() => changePage(currentPage + 1)}
                  >
                    <span className={styles.pageLink}>&gt;</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalPopularByGenre;