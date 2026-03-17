"use client";

import React from 'react';
import styles from './JournalIssues.module.css';

interface Issue {
  issueTitle: string;
  volume: string;
  publishDate: string;
  pageNumber: string;
  authorName: string;
  issueFileName: string;
}

interface IssueYearAccordionProps {
  year: string;
  issues: Issue[][]; // Chunked into arrays of 2 for grid rows
  isOpen: boolean;
  onToggle: () => void;
  onDownload: (fileName: string) => void;
}

export const IssueYearAccordion = ({ 
  year, 
  issues, 
  isOpen, 
  onToggle, 
  onDownload 
}: IssueYearAccordionProps) => {

  return (
    <div className={`accordion-item ${styles.accordionItem}`}>
      <h2 className="accordion-header">
        <button 
          className={`accordion-button ${!isOpen ? 'collapsed' : ''} ${styles.accordionColor}`}
          type="button"
          onClick={onToggle}
        >
          Published Year: {year}
        </button>
      </h2>
      
      <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
        <div className="accordion-body bg-white p-4">
          {issues.map((row, rowIndex) => (
            <div className="row mb-3" key={rowIndex}>
              {row.map((issue, colIndex) => (
                <div className="col-md-6 mb-3" key={`${year}-${rowIndex}-${colIndex}`}>
                  <div className={styles.issueCard}>
                    {/* Title */}
                    <h5 className={styles.issueTitle}>
                      {issue.issueTitle}
                    </h5>

                    {/* Volume */}
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Volume:</span>
                      <span className={styles.valPink}>{issue.volume || '1'}</span>
                    </div>

                    {/* Published Date */}
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Published:</span>
                      <span className={styles.value}>
                        {new Date(issue.publishDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Pages */}
                    <div className={styles.infoRow} style={{ borderBottom: 'none' }}>
                      <span className={styles.label}>Pages:</span>
                      <span className={styles.value}>{issue.pageNumber || '01-06'}</span>
                    </div>

                    {/* Authors */}
                    <div className={styles.authorBox}>
                      <div className={styles.label}>Author(s):</div>
                      <div className={styles.authorName}>
                        {issue.authorName || 'N/A'}
                      </div>
                    </div>

                    {/* PDF Action */}
                    <button 
                      className={`${styles.pdfBtn} mt-3`}
                      onClick={() => onDownload(issue.issueFileName)}
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i> 
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// "use client";

// import React, { useState } from 'react';
// import styles from './JournalIssues.module.css';

// interface Issue {
//   issueTitle: string;
//   volume: string;
//   publishDate: string;
//   pageNumber: string;
//   authorName: string;
//   issueFileName: string;
// }

// interface IssueYearAccordionProps {
//   year: string;
//   issues: Issue[][]; // Chunked by 2
//   isOpen: boolean;
//   onToggle: () => void;
//   onDownload: (fileName: string) => void;
// }

// export const IssueYearAccordion = ({ year, issues, isOpen, onToggle, onDownload }: IssueYearAccordionProps) => {
//   const [expandedTitles, setExpandedTitles] = useState<Set<string>>(new Set());

//   const toggleTitle = (key: string) => {
//     const newSet = new Set(expandedTitles);
//     newSet.has(key) ? newSet.delete(key) : newSet.add(key);
//     setExpandedTitles(newSet);
//   };

//   const formatTitle = (title: string, key: string) => {
//     if (!title) return '';
//     const words = title.trim().split(/\s+/);
//     return !expandedTitles.has(key) && words.length > 5 
//       ? words.slice(0, 5).join(' ') + '...' 
//       : title;
//   };

//   return (
//     <div className="accordion-item mb-3 border rounded overflow-hidden">
//       <h2 className="accordion-header">
//         <button 
//           className={`accordion-button ${!isOpen ? 'collapsed' : ''} ${styles.accordionColor}`}
//           onClick={onToggle}
//         >
//           <span className="fw-bold">Published Year: {year}</span>
//         </button>
//       </h2>
      
//       <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
//         <div className="accordion-body bg-light">
//           {issues.map((pair, rowIndex) => (
//             <div className="row" key={rowIndex}>
//               {pair.map((issue, colIndex) => {
//                 const uniqueKey = `${year}-${rowIndex}-${colIndex}`;
//                 return (
//                   <div className="col-md-6 mt-3" key={uniqueKey}>
//                     <div className="card shadow-sm border-0 h-100">
//                       <div className="card-body">
//                         <h5 
//                           className="fw-bold mb-3 cursor-pointer text-uppercase"
//                           onClick={() => toggleTitle(uniqueKey)}
//                           style={{ cursor: 'pointer', fontSize: '1rem' }}
//                         >
//                           {formatTitle(issue.issueTitle, uniqueKey)}
//                         </h5>
                        
//                         <div className="small text-muted mb-3">
//                           <div className="d-flex justify-content-between border-bottom pb-1 mb-1">
//                             <strong>Volume:</strong> 
//                             <span className="text-danger fw-bold">{issue.volume || 'N/A'}</span>
//                           </div>
//                           <div className="d-flex justify-content-between border-bottom pb-1 mb-1">
//                             <strong>Published:</strong> 
//                             <span>{new Date(issue.publishDate).toLocaleDateString()}</span>
//                           </div>
//                           <div className="d-flex justify-content-between">
//                             <strong>Pages:</strong> 
//                             <span>{issue.pageNumber || 'NA'}</span>
//                           </div>
//                         </div>

//                         <div className="mt-2">
//                           <strong className="small d-block mb-1">Author(s):</strong>
//                           <p className="small text-secondary mb-3" style={{ minHeight: '40px' }}>
//                             {issue.authorName || 'N/A'}
//                           </p>
//                           <button 
//                             className="btn btn-sm btn-outline-danger w-100"
//                             onClick={() => onDownload(issue.issueFileName)}
//                           >
//                             <i className="bi bi-file-earmark-pdf"></i> Download PDF
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };