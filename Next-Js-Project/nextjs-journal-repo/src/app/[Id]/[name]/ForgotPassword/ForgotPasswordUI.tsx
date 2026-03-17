"use client";
import React from 'react';
import Link from 'next/link';
import styles from './ForgotPassword.module.css';
import router from 'next/router';


const ForgotPasswordUI = ({
    currentStep, setCurrentStep, isLoading, register,
    errors, errorMessage, checkEmail, onResetSubmit,
    BookId, name, journalTitle
}: any) => {

     const getPath = (suffix: string) => `/${BookId}/${name}/${suffix}`;
    return (
        <>
            {isLoading && (
                <div className={styles.fullscreenLoader}>
                    <div className={styles.loaderContent}>
                        <span className="text-danger fs-3">Processing...</span><br />
                        <div className="spinner-grow text-warning" style={{ width: '10rem', height: '10rem' }} role="status"></div>
                    </div>
                </div>
            )}

            {!isLoading && (
                <div className={styles.container}>
                    {currentStep === 1 && (
                        <form>
                            <h3 className="main-heading">Your Registered Email</h3>
                            <input
                                type="email"
                                className={styles.inputField}
                                {...register("email")}
                            />
                            {errors.email && <small className={styles.errorText}>{errors.email.message}</small>}
                            <button
                                className="btn btn-outline-danger mt-4"
                                type="button"
                                onClick={checkEmail}
                            >
                                Next
                            </button>
                        </form>
                    )}

                    {currentStep === 2 && (
                        <div className="animate__animated animate__fadeIn">
                            <h2 className="fs-2 mb-4">Reset Password</h2>
                            <div className={styles.inlineCheckboxLabel}>
                                <input type="checkbox" id="consent" {...register("consent")} />
                                <label htmlFor="consent" className="fw-bold text-danger mb-0">
                                    I give my consent to reset my password and receive it at my registered email.
                                </label>
                            </div>
                            {errors.consent && <small className={styles.errorText}>{errors.consent.message}</small>}

                            <div className="d-flex justify-content-between mt-4">
                                <button className="btn btn-outline-danger" onClick={() => setCurrentStep(1)}>Back</button>
                                <button className="btn btn-outline-danger" onClick={onResetSubmit}>Submit</button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Navigation using your specific .loginButton styles */}
                    <div className="d-flex justify-content-between mt-5">
                        <Link href={getPath('ExternalLogin')} className={styles.loginButton} >Login</Link>
                        <Link href={getPath('About')} className={styles.loginButton} >Sign Up</Link>
                        {/* <button className={styles.loginButton} onClick={() => getPath('ExternalLogin')}>
                            Login
                        </button>
                        <button className={styles.loginButton} onClick={() =>getPath('About')}>
                            Sign Up
                        </button> */}
                    </div>
                </div>
            )}

        </>
        // <section>

        //   <div className="container-fluid p-0 mt-3">
        //     <div className="row">
        //       <div className="col-md-12 grid-margin stretch-card">
        //         <div className="card-body">
        //           <h1 className="mb-4 text-center fw-bold">Lpu e-Journals</h1>
        //           <h1 className="mb-2 text-center text-primary">Account Recovery Page</h1>
        //           <h5 className="text-center text-muted">{journalTitle}</h5>
        //         </div>
        //       </div>
        //     </div>
        //   </div>

        //   <div className="wizard-container vh-100 position-relative">

        //     {isLoading && (
        //       <div className={styles.fullscreenLoader}>
        //         <div className="text-center">
        //           <span className="text-danger fs-3 d-block mb-3">Processing...</span>
        //           <div className="spinner-grow text-warning" style={{ width: '10rem', height: '10rem' }} role="status"></div>
        //         </div>
        //       </div>
        //     )}

        //     {!isLoading && (
        //       <div className="container-fluid">
        //         <div className="row justify-content-center">
        //           <div className="col-md-6">


        //             {currentStep === 1 && (
        //               <div className="container animate__animated animate__fadeIn">
        //                 <h3 className="mb-3">Your Registered Email</h3>
        //                 <div className="form-group">
        //                   <input 
        //                     type="email" 
        //                     className={`form-control ${errors.email ? 'is-invalid' : ''}`}
        //                     {...register("email")} 
        //                     placeholder="example@domain.com"
        //                   />
        //                   {errors.email && <small className="text-danger">{errors.email.message}</small>}
        //                 </div>
        //                 <button 
        //                   className="btn btn-outline-danger mt-4" 
        //                   type="button" 
        //                   onClick={checkEmail}
        //                 >
        //                   Next
        //                 </button>
        //                 {errorMessage && <p className="text-danger mt-3 fw-bold">{errorMessage}</p>}
        //               </div>
        //             )}


        //             {currentStep === 2 && (
        //               <div className="container animate__animated animate__fadeIn">
        //                 <h2 className="fs-2 mb-4">Reset Password</h2>
        //                 <div className="form-check mb-3">
        //                   <input 
        //                     type="checkbox" 
        //                     id="consent" 
        //                     className={`form-check-input ${errors.consent ? 'is-invalid' : ''}`}
        //                     {...register("consent")} 
        //                   />
        //                   <label htmlFor="consent" className="form-check-label fw-bold text-danger">
        //                     I give my consent to reset my password and receive it at my registered email.
        //                   </label>
        //                 </div>
        //                 {errors.consent && <small className="text-danger d-block mb-3">{errors.consent.message}</small>}

        //                 <div className="d-flex justify-content-between mt-4">
        //                   <button className="btn btn-outline-danger" onClick={() => setCurrentStep(1)}>Back</button>
        //                   <button className="btn btn-outline-danger" onClick={onResetSubmit}>Submit</button>
        //                 </div>
        //               </div>
        //             )}


        //             <div className="container mt-5 border-top pt-4">
        //               <div className="d-flex justify-content-between">
        //                 <Link href={`/${BookId}/${name}/ExternalLogin`} className="btn btn-outline-danger">Login</Link>
        //                 <Link href={`/${BookId}/${name}/signup`} className="btn btn-outline-danger">Sign Up</Link>
        //               </div>
        //             </div>

        //           </div>
        //         </div>
        //       </div>
        //     )}
        //   </div>
        // </section>
    );
};

export default ForgotPasswordUI;