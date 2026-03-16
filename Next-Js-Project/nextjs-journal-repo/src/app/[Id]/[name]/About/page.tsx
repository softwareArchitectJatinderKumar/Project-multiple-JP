"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import myAppWebService from '@/services/myAppWebService';
import styles from './About.module.css';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';
import JournalDetailsTab from '@/component/JournalDetailsTab/JournalDetailsTab';

export default function JournalAbout() {
  const params = useParams();
  const router = useRouter();
  
  const [bookData, setBookData] = useState<any>(null);
  const [detailsArray, setDetailsArray] = useState<any[]>([]);
  const [editorInChief, setEditorInChief] = useState<any[]>([]);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic route parameters
  const bookId = params?.Id as string;
  const name = params?.name as string;

  // 1. Memoized helper function to parse details
  const extractDetails = useCallback((journalDetailsStr: string) => {
    if (!journalDetailsStr) return [];
    return journalDetailsStr.split('#').map(item => {
      const [key, value] = item.split(':').map(part => part.trim());
      const formattedKey = key === 'ISSNNo' ? 'ISSN No' : key.replace(/([A-Z0-9])/g, ' $1').trim();
      return { key: formattedKey, value };
    });
  }, []);

  // 2. Memoized Fetch Logic
  // This array [bookId, extractDetails, router] must stay the same size
  const fetchData = useCallback(async () => {
    if (!bookId) return;
    
    setIsLoading(true);
    try {
      // Get Journal Details
      const aboutResponse = await myAppWebService.GetJournalDetailsforAboutPage(bookId);
      const aboutData = aboutResponse?.data || aboutResponse; 

      if (aboutData?.item1?.length > 0) {
        const data = aboutData.item1[0];
        setBookData(data);
        setDetailsArray(extractDetails(data.journalDetails));
      } else {
        throw new Error("Journal not found");
      }

      // Get Editors
      const editorResponse = await myAppWebService.GetAllJournalEditorsDetails();
      const editorData = editorResponse?.data || editorResponse;

      if (editorData?.item1) {
        const filtered = editorData.item1.filter((item: any) => item.journalId === bookId);
        const eic = filtered.filter((item: any) => 
          item.editorType?.toLowerCase().includes('editor in chief')
        );
        setEditorInChief(eic);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while loading the journal data!',
      }).then(() => router.push('/'));
    } finally {
      setIsLoading(false);
    }
  }, [bookId, extractDetails, router]); 

  // 3. Execution on Mount
  useEffect(() => {
    fetchData();
  }, [fetchData]); // This size is constant (1)

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-grow text-danger" style={{ width: '5rem', height: '5rem' }} role="status"></div>
        <p className="text-danger mt-3">Loading Journal Details...</p>
      </div>
    );
  }

  return (
    <section>
      <JournalMenuBar />
      <JournalInnerMenu />
      
      <div className="container about-journal mt-5">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            {!imageLoadError ? (
              <img 
                src={bookData?.imageUrl} 
                alt={bookData?.journalTitle} 
                className="img-fluid rounded shadow"
                onError={() => setImageLoadError(true)} 
              />
            ) : (
              <div className="p-5 bg-light text-center border">Image Error</div>
            )}
          </div>

          <div className="col-lg-4 col-md-6">
            <h2 className="fw-bold">{bookData?.journalTitle}</h2>
            <ul className="list-unstyled mt-3">
              <li>Volume: <span className={styles.editorColor1}>{bookData?.volume || 'NA'}</span></li>
              <li>Year: <span className={styles.editorColor1}>
                {bookData?.publishDate ? new Date(bookData.publishDate).getFullYear() : 'NA'}
              </span></li>
              
              {editorInChief.length > 0 && (
                <li className="mt-2">
                  <strong>Editor In Chief:</strong><br/>
                  {editorInChief.map((editor, i) => (
                    <span key={i} className={styles.editorColor1}>
                      {editor.editorName}{i < editorInChief.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </li>
              )}
            </ul>
            <p className="mt-3 text-secondary">{bookData?.subTitle}</p>
          </div>

          <div className={ styles.JournalsDetails + " col-lg-4 " }>
            <div className={ ' p-3 ' }>
              <ul className="list-unstyled mb-0">
                {detailsArray.map((detail, idx) => (
                  detail.key !== 'Scope' && (
                    <li key={idx} className="mb-4 d-flex justify-content-between  pb-2">
                      <span className="fw-bold small">{detail.key}:</span>
                      <span className="small">{detail.value}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <button 
              className="btn btn-warning px-5 py-2 rounded-pill fw-bold"
              onClick={() => router.push(`/${bookId}/${name}/SubmitManuScript`)}
            >
              Upload Manuscript
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <JournalDetailsTab items={bookData} />
      </div>
    </section>
  );
}
// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';
// import myAppWebService from '@/services/myAppWebService';
// import styles from './About.module.css';
// import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
// import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';
// import JournalDetailsTab from '@/component/JournalDetailsTab/JournalDetailsTab';

// export default function JournalAbout() {
//   const params = useParams();
//   const router = useRouter();
  
//   const [bookData, setBookData] = useState<any>(null);
//   const [detailsArray, setDetailsArray] = useState<any[]>([]);
//   const [editorInChief, setEditorInChief] = useState<any[]>([]);
//   const [imageLoadError, setImageLoadError] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const bookId = params?.Id as string;
//   const name = params?.name as string;
//   const journalTitleDisplay = name?.replace(/-/g, ' ');

//   const extractDetails = useCallback((journalDetailsStr: string) => {
//     if (!journalDetailsStr) return [];
//     const items = journalDetailsStr.split('#').map(item => item.trim());
    
//     return items.map(item => {
//       const [key, value] = item.split(':').map(part => part.trim());
//       let formattedKey = key === 'ISSNNo' ? 'ISSN No' : key.replace(/([A-Z0-9])/g, ' $1').trim();
//       return { key: formattedKey, value };
//     });
//   }, []);

//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     try {
 

//       const aboutData =  await myAppWebService.GetAllJournalEditorsDetails();
      
//       if (aboutData?.item1?.length > 0) {
//         const data = aboutData.item1[0];
//         setBookData(data);
//         setDetailsArray(extractDetails(data.journalDetails));
//       } else {
//         throw new Error("No data found");
//       }

    
//       const editorData = await myAppWebService.GetJournalDetailsforAboutPage(bookId);
   
//       if (editorData?.item1) {
//         const filtered = editorData.item1.filter((item: any) => item.journalId === bookId);
//         const eic = filtered.filter((item: any) => 
//           item.editorType.toLowerCase().includes('editor in chief')
//         );
//         setEditorInChief(eic);
//       }

//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Something went wrong!',
//       }).then(() => router.push('/'));
//     } finally {
//       setIsLoading(false);
//     }
//   }, [bookId, extractDetails, router]);

//   useEffect(() => {
//     if (bookId) fetchData();
//   }, [bookId, fetchData]);

//   if (isLoading) {
//     return (
//       <div className="container text-center py-5">
//         <span className="text-danger fs-3">Loading</span>
//         <div className="spinner-grow text-danger d-block mx-auto mt-3" style={{ width: '10rem', height: '10rem' }} />
//       </div>
//     );
//   }

//   return (
//     <section>
//       <JournalMenuBar />
//       <JournalInnerMenu />
      
//       <div className="container about-journal mt-5">
//         <div className="row">
//           <div className="col-lg-4 col-md-6">
//             {!imageLoadError ? (
//               <img 
//                 src={bookData?.imageUrl} 
//                 alt={bookData?.journalTitle} 
//                 className="img-fluid"
//                 onError={() => setImageLoadError(true)} 
//               />
//             ) : (
//               <div className="fs-3 text-danger mt-5">Error in Loading Image</div>
//             )}
//           </div>

//           <div className="col-lg-4 col-md-6">
//             <h2 className="fw-bold">{bookData?.journalTitle}</h2>
//             <ul className="list-unstyled mt-3" style={{ fontWeight: 500 }}>
//               <li>Volume: <span className={styles.editorColor1}>{bookData?.volume || 'NA'}</span></li>
//               <li>Year: <span className={styles.editorColor1}>
//                 {bookData?.publishDate ? new Date(bookData.publishDate).getFullYear() : 'NA'}
//               </span></li>
              
//               {editorInChief.length > 0 && (
//                 <li>
//                   Editor In Chief: {' '}
//                   {editorInChief.map((editor, i) => (
//                     <span key={i} className={styles.editorColor1}>
//                       {editor.editorName}{i < editorInChief.length - 1 ? ', ' : ''}
//                     </span>
//                   ))}
//                 </li>
//               )}
//             </ul>
//             <p className="mt-3">{bookData?.subTitle}</p>
//           </div>

//           <div className="col-lg-4">
//             <div className={styles.journalDetails}>
//               <ul className="list-unstyled">
//                 {detailsArray.map((detail, idx) => (
//                   detail.key !== 'Scope' && (
//                     <li key={idx} className="mb-3 d-flex justify-content-between">
//                       <span className="fw-bold">{detail.key}:</span>
//                       <span className="text-end">{detail.value}</span>
//                     </li>
//                   )
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="row mt-5">
//           <div className="col-md-12 text-center">
//             <h1 className="mb-4">Submit your Manuscript in the Journal</h1>
//             <button 
//               className="btn btn-warning px-5 py-2 rounded-pill fw-bold"
//               onClick={() => router.push(`/${bookId}/${name}/SubmitManuScript`)}
//             >
//               Upload
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-5">
//         <JournalDetailsTab items={bookData} />
//       </div>  
//     </section>
//   );
// }