"use client";

import React from 'react';
import styles from './ExternalLogin.module.css';

export const ExternalLoginForm = ({ 
    register, handleSubmit, OnSubmit, errors, JournalTitle, 
    showPassword, togglePasswordVisibility, errorMessage, 
    isLoading, loadingIndicator, submitted, VisitUrl, BookId, name 
}: any) => {

    if (loadingIndicator) {
        return (
            <div className={styles.errorContainer}>
                <div className="text-center">
                    <span className="text-danger fs-3">Loading</span><br />
                    <div className="spinner-grow text-danger" style={{ width: '14rem', height: '14rem' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginPageContainer}  >
            <div className="row mt-4">
                <div className="text-center">
                    <h1 className="text-danger fw-bold">{JournalTitle}</h1>
                </div>
            </div>

            {isLoading && (
                <div className={styles.fullscreenLoader}>
                    <div className={styles.loaderContent}>
                        <span className="text-danger fs-3">Processing...</span><br />
                        <div className="spinner-grow text-danger" style={{ width: '16rem', height: '16rem' }}></div>
                    </div>
                </div>
            )}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className={styles.loginCardWrapper}>
                            <div className="row g-0">
                                {/* Left Side Image */}
                                <div className="col-lg-6 d-none d-lg-block">
                                    <div className={styles.loginImageWrapper}>
                                        <div className={styles.imageOverlay}></div>
                                    </div>
                                </div>

                                {/* Right Side Form */}
                                <div className="col-12 col-lg-6 p-4 p-lg-5">
                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold">Welcome Back</h2>
                                        <p className="text-muted">Sign in to access LPU e-Journals</p>
                                    </div>

                                    <form onSubmit={handleSubmit(OnSubmit)}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Email Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-envelope"></i>
                                                </span>
                                                <input 
                                                    {...register("Email")}
                                                    type="email" 
                                                    className={`form-control border-start-0 ${submitted && errors.Email ? 'is-invalid' : ''}`}
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            {submitted && errors.Email && <div className="text-danger small mt-1">{errors.Email.message}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-lock"></i>
                                                </span>
                                                <input 
                                                    {...register("Password")}
                                                    type={showPassword ? 'text' : 'password'} 
                                                    className={`form-control border-start-0 border-end-0 ${submitted && errors.Password ? 'is-invalid' : ''}`}
                                                    placeholder="Enter your password"
                                                />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={togglePasswordVisibility}>
                                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                </button>
                                            </div>
                                            {submitted && errors.Password && <div className="text-danger small mt-1">{errors.Password.message}</div>}
                                        </div>

                                        {errorMessage && (
                                            <div className="alert alert-danger py-2 mb-3">
                                                <i className="bi bi-exclamation-circle me-2"></i>{errorMessage}
                                            </div>
                                        )}

                                        <div className="d-grid gap-2 mt-4">
                                            <button type="submit" className={`btn btn-primary ${styles.btnLogin}`}>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>Login
                                            </button>
                                            <button type="button" className="btn btn-outline-primary" onClick={() => VisitUrl('signup')}>
                                                <i className="bi bi-person-plus me-2"></i>Register Now
                                            </button>
                                            <button type="button" className="btn btn-link text-muted text-decoration-none small" onClick={() => VisitUrl('ForgotPassword')}>
                                                Forgot Password?
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// "use client";
// import React from 'react';
// import styles from './ExternalLogin.module.css';

// export const ExternalLoginForm = ({ 
//     register, handleSubmit, onSubmit, errors, 
//     journalTitle, showPassword, togglePassword, 
//     errorMessage, isLoading, onVisit 
// }: any) => {
//     return (
//         <div className={styles.wrapper}>
//             {/* Header */}
//             <div className="row mt-4">
//                 <div className="text-center">
//                     <h1 className="  fw-bold">{journalTitle}</h1>
//                 </div>
//             </div>

//             {/* Processing Overlay */}
//             {isLoading && (
//                 <div className={styles.fullscreenLoader}>
//                     <div className={styles.loaderContent}>
//                         <span className="text-danger fs-3">Processing...</span><br />
//                         <div className="spinner-grow  " style={{ width: '16rem', height: '16rem' }}></div>
//                     </div>
//                 </div>
//             )}

//             <div className="container">
//                 <div className="row justify-content-center">
//                     <div className="col-12 col-lg-12">
//                         <div className={styles.loginCardWrapper}>
//                             <div className="row g-0">
//                                 {/* Left Side Image */}
//                                 <div className="col-lg-6 d-none d-lg-block">
//                                     <div className={styles.loginImageSection}></div>
//                                 </div>

//                                 {/* Form Side */}
//                                 <div className={`col-12 col-lg-6 ${styles.loginFormSection}`}>
//                                     <div className="text-center mb-4">
//                                         <h2 className="fw-bold">Welcome Back</h2>
//                                         <p className="text-muted">Sign in to access LPU e-Journals</p>
//                                     </div>

//                                     <form onSubmit={handleSubmit(onSubmit)}>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold small">Email Address</label>
//                                             <div className="input-group">
//                                                 <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
//                                                 <input 
//                                                     {...register("Email")}
//                                                     type="email" 
//                                                     className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
//                                                     placeholder="Enter your email"
//                                                 />
//                                             </div>
//                                             {errors.Email && <div className="text-danger small">{errors.Email.message}</div>}
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold small">Password</label>
//                                             <div className="input-group">
//                                                 <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
//                                                 <input 
//                                                     {...register("Password")}
//                                                     type={showPassword ? 'text' : 'password'} 
//                                                     className={`form-control ${errors.Password ? 'is-invalid' : ''}`}
//                                                     placeholder="Enter your password"
//                                                 />
//                                                 <button type="button" className="btn btn-outline-secondary" onClick={togglePassword}>
//                                                     <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
//                                                 </button>
//                                             </div>
//                                             {errors.Password && <div className="text-danger small">{errors.Password.message}</div>}
//                                         </div>

//                                         {errorMessage && (
//                                             <div className="alert alert-danger py-2 small">
//                                                 <i className="bi bi-exclamation-circle me-2"></i>{errorMessage}
//                                             </div>
//                                         )}

//                                         <div className="d-grid gap-2 mt-4">
//                                             <button type="submit" className={`btn ${styles.btnLogin}`}>
//                                                 <i className="bi bi-box-arrow-in-right me-2"></i>Login
//                                             </button>
//                                             <button type="button" className={`btn ${styles.btnRegister}`} onClick={() => onVisit('signup')}>
//                                                 <i className="bi bi-person-plus me-2"></i>Register Now
//                                             </button>
//                                             <button type="button" className="btn btn-link text-muted small" onClick={() => onVisit('ForgotPassword')}>
//                                                 Forgot Password?
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// "use client";

// import React from 'react';
// import { UseFormRegister, FieldErrors } from 'react-hook-form';
// import styles from './ExternalLogin.module.css';
// import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
// import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';

// interface ExternalLoginFormProps {
//   register: UseFormRegister<any>;
//   errors: FieldErrors<any>;
//   onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
//   showPassword: boolean;
//   togglePassword: () => void;
//   journalTitle: string;
//   errorMessage: string;
//   onRegisterClick: () => void;
//   onForgotClick: () => void;
// }

// export const ExternalLoginForm = ({
//   register,
//   errors,
//   onSubmit,
//   showPassword,
//   togglePassword,
//   journalTitle,
//   errorMessage,
//   onRegisterClick,
//   onForgotClick
// }: ExternalLoginFormProps) => {
//   return (
//       <>
//           <JournalMenuBar />
//           <JournalInnerMenu />
//           <div className={styles.loginWrapper}>
//               <div className="text-center mb-4">
//                   <h1 className={styles.mainHeading}>{journalTitle}</h1>
//                   <h2 className={styles.loginTitle}>Welcome Back</h2>
//                   <p className="text-muted">Sign in to access LPU e-Journals</p>
//               </div>

//               <form onSubmit={onSubmit} className="forms-sample">
//                   {/* Email Field */}
//                   <div className="mb-3">
//                       <label className="form-label fw-bold">Email Address</label>
//                       <div className="input-group">
//                           <span className="input-group-text bg-white border-end-0">
//                               <i className="bi bi-envelope text-muted"></i>
//                           </span>
//                           <input
//                               {...register("Email")}
//                               type="email"
//                               className={`form-control border-start-0 ${errors.Email ? 'is-invalid' : ''}`}
//                               placeholder="Enter your email"
//                           />
//                           {errors.Email && <div className="invalid-feedback">{errors.Email.message as string}</div>}
//                       </div>
//                   </div>

//                   {/* Password Field */}
//                   <div className="mb-3">
//                       <label className="form-label fw-bold">Password</label>
//                       <div className="input-group">
//                           <span className="input-group-text bg-white border-end-0">
//                               <i className="bi bi-lock text-muted"></i>
//                           </span>
//                           <input
//                               {...register("Password")}
//                               type={showPassword ? 'text' : 'password'}
//                               className={`form-control border-start-0 border-end-0 ${errors.Password ? 'is-invalid' : ''}`}
//                               placeholder="Enter your password"
//                           />
//                           <button
//                               type="button"
//                               className="btn btn-outline-secondary border-start-0"
//                               onClick={togglePassword}
//                           >
//                               <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
//                           </button>
//                           {errors.Password && <div className="invalid-feedback">{errors.Password.message as string}</div>}
//                       </div>
//                   </div>

//                   {/* Error Alert */}
//                   {errorMessage && (
//                       <div className="alert alert-danger d-flex align-items-center py-2">
//                           <i className="bi bi-exclamation-circle me-2"></i>
//                           <small>{errorMessage}</small>
//                       </div>
//                   )}

//                   {/* Buttons */}
//                   <div className="d-grid gap-2 mt-4">
//                       <button type="submit" className={`btn ${styles.btnLogin}`}>
//                           <i className="bi bi-box-arrow-in-right me-2"></i>Login
//                       </button>
//                       <button type="button" onClick={onRegisterClick} className={`btn ${styles.btnRegister}`}>
//                           <i className="bi bi-person-plus me-2"></i>Register Now
//                       </button>
//                       <button type="button" onClick={onForgotClick} className="btn btn-link text-muted text-decoration-none small">
//                           Forgot Password?
//                       </button>
//                   </div>
//               </form>
//           </div>
//       </>
//   );
// };