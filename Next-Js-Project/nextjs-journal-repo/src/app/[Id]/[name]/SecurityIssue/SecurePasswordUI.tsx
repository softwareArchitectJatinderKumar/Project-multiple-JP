"use client";
import React from 'react';
import styles from './SecurePasswordUI.module.css';

const SecurePasswordUI = ({ register, onSubmit, errors, isVerified, isVerifying, isSubmitting, errorMessage, successMessage, userDetails, verifyIdentity }: any) => {
  return (
    <section className="reset-section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-4 text-danger">
          <h2 className="title mb-3 p-2">For security reasons, you must update your password before continuing.</h2>
        </div>

        <div className="card shadow-lg border-0 p-4 mx-auto" style={{ maxWidth: '60rem' }}>
          <h3 className="text-center text-primary mb-4">Secure Password Update</h3>

          {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

          <div className="progress mb-4" style={{ height: '6px' }}>
            <div className="progress-bar bg-primary" style={{ width: isVerified ? '100%' : '50%' }}></div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            {/* Step 1 */}
            {!isVerified && (
              <div>
                <h5 className="text-primary mb-3">Step 1: Verify Your Mobile</h5>
                <div className="mb-3">
                  <label className="form-label">Registered Email ID</label>
                  <input {...register("emailId")} type="text" readOnly className="form-control-plaintext border-bottom" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Enter Registered Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fa fa-phone"></i></span>
                    <input 
                      {...register("mobileNumber")} 
                      type="text" 
                      className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`} 
                      placeholder="Enter 10-digit mobile" 
                    />
                  </div>
                </div>

                <button 
                  type="button" // KEEP AS BUTTON to avoid validating passwords yet
                  className="btn btn-warning w-100" 
                  disabled={isVerifying} 
                  onClick={verifyIdentity}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Mobile Number'}
                </button>
              </div>
            )}

            {/* Step 2 */}
            {isVerified && (
              <div className="animate__animated animate__fadeIn">
                <h5 className="text-success mb-3">Step 2: Update Your Password</h5>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fa fa-lock"></i></span>
                    <input 
                      {...register("newPassword")} 
                      type="password" 
                      className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`} 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fa fa-lock"></i></span>
                    <input 
                      {...register("confirmNewPassword")} 
                      type="password" 
                      className={`form-control ${errors.confirmNewPassword || errors.root ? 'is-invalid' : ''}`} 
                    />
                  </div>
                  {errors.confirmNewPassword && <div className="invalid-feedback d-block">{errors.confirmNewPassword.message}</div>}
                </div>

                <button 
                  type="submit" // THIS TRIGGERS THE API
                  className="btn btn-primary w-100" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SecurePasswordUI;
// "use client";
// import React from 'react';
// import styles from './SecurePasswordUI.module.css';

// const SecurePasswordUI = ({ 
//   register, handleSubmit, onSubmit, errors, isVerified, 
//   isVerifying, isSubmitting, errorMessage, successMessage, 
//   userDetails, verifyIdentity, JournalTitle 
// }: any) => {
//   return (
//     <section className={styles.resetSection}>
//       <div className="container">
//         <div className="text-center mb-4 text-danger">
//           <h2 className={`${styles.title} mb-3 p-2`}>
//             For security reasons, you must update your password before continuing.
//           </h2>
//         </div>

//         <div className={`${styles.card} shadow-lg border-0 p-4 mx-auto`} style={{ maxWidth: '60rem' }}>
//           <h3 className="text-center text-primary mb-4">Secure Password Update</h3>
          
//           {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
//           {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

//           <div className="progress mb-4" style={{ height: '6px' }}>
//             <div 
//               className="progress-bar bg-primary" 
//               style={{ width: isVerified ? '100%' : '50%', transition: 'width 0.6s ease' }}
//             ></div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} noValidate>
//             {/* Step 1: Verify Identity */}
//             {!isVerified && (
//               <div>
//                 <h5 className="text-primary mb-3">Step 1: Verify Your Mobile</h5>
//                 <div className="mb-3">
//                   <label className="form-label">Registered Email ID</label>
//                   <input 
//                     type="text" 
//                     value={userDetails?.emailId || ''} 
//                     readOnly 
//                     className="form-control-plaintext border-bottom" 
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Enter Registered Mobile Number</label>
//                   <div className="input-group">
//                     <span className="input-group-text"><i className="fa fa-phone"></i></span>
//                     <input 
//                       {...register("mobileNumber")}
//                       type="text" 
//                       className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
//                       placeholder="Enter your 10-digit mobile number"
//                     />
//                     {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber.message}</div>}
//                   </div>
//                 </div>

//                 <button 
//                   type="button" 
//                   className="btn btn-warning w-100"
//                   disabled={isVerifying}
//                   onClick={verifyIdentity}
//                 >
//                   {isVerifying ? 'Verifying...' : 'Verify Mobile Number'}
//                 </button>
//               </div>
//             )}

//             {/* Step 2: Update Password */}
//             {isVerified && (
//               <div>
//                 <h5 className="text-success mb-3">Step 2: Update Your Password</h5>
//                 <div className="mb-3">
//                   <label className="form-label">New Password</label>
//                   <div className="input-group">
//                     <span className="input-group-text"><i className="fa fa-lock"></i></span>
//                     <input 
//                       {...register("newPassword")}
//                       type="password" 
//                       className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
//                       placeholder="Enter new password"
//                     />
//                   </div>
//                   {errors.newPassword && <div className="text-danger small">{errors.newPassword.message}</div>}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Confirm New Password</label>
//                   <div className="input-group">
//                     <span className="input-group-text"><i className="fa fa-lock"></i></span>
//                     <input 
//                       {...register("confirmNewPassword")}
//                       type="password" 
//                       className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
//                       placeholder="Re-enter new password"
//                     />
//                   </div>
//                   {errors.confirmNewPassword && <div className="text-danger small">{errors.confirmNewPassword.message}</div>}
//                 </div>

//                 <button 
//                   type="submit" 
//                   className="btn btn-primary w-100" 
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Updating...' : 'Update Password'}
//                 </button>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SecurePasswordUI;