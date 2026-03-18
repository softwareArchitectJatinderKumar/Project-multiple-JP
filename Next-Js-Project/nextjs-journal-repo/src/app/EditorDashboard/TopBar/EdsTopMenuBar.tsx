"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './EdsTopMenuBar.module.scss';

const EdsTopMenuBar = () => {
    const router = useRouter();
    
    // States
    const [loginStatus, setLoginStatus] = useState(false);
    const [userContext, setUserContext] = useState({
        candidateName: '',
        departmentName: '',
        userRole: ''
    });
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

    useEffect(() => {
        const authData = Cookies.get('authData');
        const isLoggedIn = !!authData; 

        if (isLoggedIn && authData) {
            try {
                const data = JSON.parse(authData);
                setUserContext({
                    candidateName: data.CandidateName || '',
                    departmentName: data.DepartmentName || 'N-A',
                    userRole: data.UserRole || 'Internal User'
                });
                setLoginStatus(true);
            } catch (error) {
                console.error("Cookie parse error", error);
                handleLogout();
            }
        } else {
            setLoginStatus(false);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('authData');
        Cookies.remove('BookData');
        sessionStorage.clear();
        localStorage.clear();
        setLoginStatus(false);
        router.push('/Home');
    };

    // FIX: Updated to point to your ManageUsers folder with Query Params
    const navigateToManageUsers = (roleId: string) => {
        router.push(`/EditorDashboard/ManageUsers?Role=${roleId}`);
    };

    // Navigates to the ManageUsers folder with the Role as a Query Param
    const navigateToRole = (roleId: string) => {
        router.push(`/EditorDashboard/ManageUsers?Role=${roleId}`);
    };

    if (!loginStatus) return null;

    return (
        <>
        <header className={`${styles.header} border-bottom`}>
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg">
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={`collapse navbar-collapse ${!isNavbarCollapsed ? 'show' : ''}`}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                  <li className="nav-item dropdown">
                    <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
                      Editorial Board
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/EditorDashboard/ManageBoardMembers" className="dropdown-item">
                          Manage Members
                        </Link>
                      </li>
                    </ul>
                  </li>


                  <li className="nav-item dropdown">
                    <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
                      Manage User
                    </a>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => navigateToRole('0')}>Editor</button></li>
                      <li><button className="dropdown-item" onClick={() => navigateToRole('1')}>Author</button></li>
                      <li><button className="dropdown-item" onClick={() => navigateToRole('2')}>Reviewer</button></li>
                      <li><button className="dropdown-item" onClick={() => navigateToRole('4')}>Managing Editor</button></li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
                      Account Setting
                    </a>
                    <ul className={`dropdown-menu ${styles.dropDownWidth}`}>
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </li>
                </ul>
              </div>

              <Link href="/" className="navbar-brand mx-0">
                <img src="/assets/images/logo/logo.svg" alt="Logo" />
              </Link>
            </nav>
          </div>
        </header>

            <div className="container-fluid mt-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-4 text-center">
                                <label className="form-label fw-bolder">{userContext.candidateName}</label>
                            </div>
                            <div className="col-4 text-center">
                                <label className="text-success fs-5 fw-bolder">Lpu e-Journal Editors Dashboard</label>
                            </div>
                            <div className="col-4 text-center">
                                <label className="form-label text-dark fw-bolder">{userContext.departmentName}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EdsTopMenuBar;
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import styles from './EdsTopMenuBar.module.scss';

// const EdsTopMenuBar = () => {
//     const router = useRouter();
 
//     const [loginStatus, setLoginStatus] = useState(false);
//     const [userContext, setUserContext] = useState({
//         candidateName: '',
//         departmentName: '',
//         userRole: ''
//     });
//     const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

//     useEffect(() => {
//         const authData = Cookies.get('authData');
//         const isLoggedIn = !!authData; 

//         if (isLoggedIn && authData) {
//             try {
//                 const data = JSON.parse(authData);
//                 setUserContext({
//                     candidateName: data.CandidateName || '',
//                     departmentName: data.DepartmentName || 'N-A',
//                     userRole: data.UserRole || 'Internal User'
//                 });
//                 setLoginStatus(true);
//             } catch (error) {
//                 console.error("Cookie parse error", error);
//                 handleLogout();
//             }
//         } else {
//             setLoginStatus(false);
//         }
//     }, []);

//     const handleLogout = () => {
       
//         Cookies.remove('authData');
//         Cookies.remove('BookData');
//         sessionStorage.clear();
//         localStorage.clear();
        
//         setLoginStatus(false);
//         router.push('/Home');
//     };

//     const navigateTo = (role: string) => {
  
//         router.push(`/EditorDashboard/ManageUsers?Role=${role}`);
//     };

//     if (!loginStatus) return null;

//     return (
//         <>
//             <header className={`${styles.header} border-bottom`}>
//                 <div className="container-fluid">
//                     <nav className="navbar navbar-expand-lg">
//                         <button 
//                             className="navbar-toggler" 
//                             type="button" 
//                             onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
//                         >
//                             <span className="navbar-toggler-icon"></span>
//                         </button>

//                         <div className={`collapse navbar-collapse ${!isNavbarCollapsed ? 'show' : ''}`}>
//                             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
 
//                                 <li className="nav-item dropdown">
//                                     <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
//                                         Editorial Board
//                                     </a>
//                                     <ul className="dropdown-menu">
//                                         <li>
//                                             <button className="dropdown-item" onClick={() => navigateTo('/EditorDashboard/ManageBoardMembers')}>
//                                                 Manage Members
//                                             </button>
//                                         </li>
//                                     </ul>
//                                 </li>
 
//                                 <li className="nav-item dropdown">
//                                     <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
//                                         Manage User
//                                     </a>
//                                     <ul className={`dropdown-menu ${styles.dropDownWidth}`}>
//                                         <li><button className="dropdown-item" onClick={() => navigateTo('/E/0/EdsManageUser')}>Editor</button></li>
//                                         <li><button className="dropdown-item" onClick={() => navigateTo('/E/1/EdsManageUser')}>Author</button></li>
//                                         <li><button className="dropdown-item" onClick={() => navigateTo('/E/2/EdsManageUser')}>Reviewer</button></li>
//                                         <li><button className="dropdown-item" onClick={() => navigateTo('/E/4/EdsManageUser')}>Managing Editor</button></li>
//                                     </ul>
//                                 </li>

                          
//                                 <li className="nav-item dropdown">
//                                     <a className={`nav-link dropdown-toggle ${styles.navLink}`} href="#" role="button" data-bs-toggle="dropdown">
//                                         Account Setting
//                                     </a>
//                                     <ul className={`dropdown-menu ${styles.dropDownWidth}`}>
//                                         <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
//                                     </ul>
//                                 </li>
//                             </ul>
//                         </div>

//                         <Link href="/" className="navbar-brand mx-0">
//                             <img src="/assets/images/logo/logo.svg" alt="Logo" />
//                         </Link>
//                     </nav>
//                 </div>
//             </header>
 
//             <div className="container-fluid mt-4">
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <div className="row align-items-center">
//                             <div className="col-4 text-center">
//                                 <label className="form-label fw-bolder">{userContext.candidateName}</label>
//                             </div>
//                             <div className="col-4 text-center">
//                                 <label className="text-success fs-5 fw-bolder">Lpu e-Journal Editors Dashboard</label>
//                             </div>
//                             <div className="col-4 text-center">
//                                 <label className="form-label text-dark fw-bolder">{userContext.departmentName}</label>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default EdsTopMenuBar;

// "use client";

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';
// import styles from './LpuloginPage.module.css';
// import Cookies from 'js-cookie';
// import myAppWebService from '@/services/myAppWebService';
// import Link from 'next/link';
// import { storageService } from '@/services/storageService';

// export default function EdsTopMenuBar() {
//   const router = useRouter();
//   const [loginStatus, setLoginStatus] = useState(false);
//   const [userData, setUserData] = useState({
//     candidateName: '',
//     departmentName: '',
//     userRole: ''
//   });

//   const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//   useEffect(() => {
//     const checkLogin = () => {
//       const authDataStr = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('authData='))
//         ?.split('=')[1];
      
//       const isLoggedIn = storageService.isLoggedIn(); // Your auth check logic

//       if (authDataStr && isLoggedIn) {
//         try {
//           const data = JSON.parse(decodeURIComponent(authDataStr));
//           setUserData({
//             candidateName: data.CandidateName || '',
//             departmentName: data.DepartmentName || 'N-A',
//             userRole: data.UserRole || 'Internal User'
//           });
//           setLoginStatus(true);
//         } catch (err) {
//           console.error('Invalid cookie data', err);
//           handleLogout();
//         }
//       } else {
//         handleLogout();
//       }
//     };

//     checkLogin();
//   }, []);

//   const handleLogout = () => {
//     // Clear Cookies/Storage
//     document.cookie = "authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     sessionStorage.clear();
//     localStorage.clear();
     

//     setLoginStatus(false);
//     router.push('/Home');
//   };

//   const toggleDropdown = (name: string) => {
//     setActiveDropdown(activeDropdown === name ? null : name);
//   };

//   if (!loginStatus) return null;

//   return (
//     <>
//       <header className="border-b border-black/10 bg-white">
//         <div className="container-fluid px-4">
//           <nav className="navbar flex flex-wrap items-center justify-between py-2">
//             {/* Mobile Toggler */}
//             <button 
//               className="lg:hidden p-2 border rounded"
//               onClick={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
//             >
//               <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
//               <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
//               <span className="block w-6 h-0.5 bg-gray-600"></span>
//             </button>

//             <div className={`${isNavbarCollapsed ? 'hidden' : 'block'} lg:flex lg:items-center w-full lg:w-auto flex-grow`}>
//               <ul className="flex flex-col lg:flex-row list-none lg:mr-auto mb-0">
                
//                 {/* Editorial Board Dropdown */}
//                 <li className="relative group px-4 border-l border-gray-300 lg:first:border-0 lg:first:mr-5">
//                   <button 
//                     onClick={() => toggleDropdown('editorial')}
//                     className="text-xs font-semibold uppercase py-3 flex items-center gap-1"
//                   >
//                     Editorial Board <i className="material-icons text-sm">arrow_drop_down</i>
//                   </button>
//                   {activeDropdown === 'editorial' && (
//                     <ul className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
//                       <li>
//                         <Link href="/EdsEditorDashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
//                           Manage Members
//                         </Link>
//                       </li>
//                     </ul>
//                   )}
//                 </li>

//                 {/* Manage User Dropdown */}
//                 <li className="relative group px-4 border-l border-gray-300">
//                   <button 
//                     onClick={() => toggleDropdown('manageUser')}
//                     className="text-xs font-semibold uppercase py-3 flex items-center gap-1"
//                   >
//                     Manage User <i className="material-icons text-sm">arrow_drop_down</i>
//                   </button>
//                   {activeDropdown === 'manageUser' && (
//                     <ul className="absolute left-0 mt-2 w-56 bg-white border shadow-lg z-50 ml-5">
//                       <li><Link href="/E/0/EdsManageUser" className="block px-4 py-2 text-sm hover:bg-gray-100">Editor</Link></li>
//                       <li><Link href="/E/1/EdsManageUser" className="block px-4 py-2 text-sm hover:bg-gray-100">Author</Link></li>
//                       <li><Link href="/E/2/EdsManageUser" className="block px-4 py-2 text-sm hover:bg-gray-100">Reviewer</Link></li>
//                       <li><Link href="/E/4/EdsManageUser" className="block px-4 py-2 text-sm hover:bg-gray-100">Managing Editor</Link></li>
//                     </ul>
//                   )}
//                 </li>

//                 {/* Account Settings */}
//                 <li className="relative group px-4 border-l border-gray-300">
//                   <button 
//                     onClick={() => toggleDropdown('account')}
//                     className="text-xs font-semibold uppercase py-3 flex items-center gap-1"
//                   >
//                     Account Setting <i className="material-icons text-sm">arrow_drop_down</i>
//                   </button>
//                   {activeDropdown === 'account' && (
//                     <ul className="absolute left-0 mt-2 w-48 bg-white border shadow-lg z-50">
//                       <li>
//                         <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100">
//                           Logout
//                         </button>
//                       </li>
//                     </ul>
//                   )}
//                 </li>
//               </ul>
//             </div>

//             <Link href="/" className="ml-auto lg:ml-0">
//               <img src="/assets/images/logo/logo.svg" alt="Logo" className="h-20 w-auto" />
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* Info Bar */}
//       <div className="container-fluid mt-4 px-4">
//         <div className="bg-white rounded shadow-sm border p-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <div className="text-center font-bold">{userData.candidateName}</div>
//             <div className="text-center text-green-600 text-xl font-bold">
//               Lpu e-Journal Editors Dashboard
//             </div>
//             <div className="text-center font-bold text-gray-800">
//               {userData.departmentName}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }