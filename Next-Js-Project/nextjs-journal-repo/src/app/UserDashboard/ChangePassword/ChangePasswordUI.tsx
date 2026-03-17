"use client";

import React from 'react';

const ChangePasswordUI = ({ 
  currentStep, setCurrentStep, register, errors, 
  errorMessage, idProofType, handleVerifyId, onFinalSubmit 
}: any) => {
  return (
    <div className="bg-light">
      {/* Header Section */}
      <div className="vh-150 d-flex p-2 align-items-center justify-content-center">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card-body m-5">
                <h1 className="text-center themeClr">Update Password Screen</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-container vh-100">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card-body">
                
                {/* Step 1: Verify ID Proof */}
                {currentStep === 1 && (
                  <div className="container animate__animated animate__fadeIn">
                    <h2 className="col-md-12 fs-2">Verify {idProofType} Number</h2>
                    <div className="form-group mt-3">
                      <input 
                        type="password" 
                        className="form-control"
                        {...register("idProofNumber")} 
                        placeholder={`Enter ${idProofType}`}
                      />
                      {errors.idProofNumber && (
                        <small className="text-danger">{errors.idProofNumber.message}</small>
                      )}
                    </div>
                    
                    <div className="row d-flex justify-content-center mt-4 mb-2">
                      <button 
                        className="btn btn-primary col-2 me-4" 
                        onClick={handleVerifyId}
                      >
                        Next
                      </button>
                    </div>
                    {errorMessage && <p className="error text-danger fs-5 p-4 fw-bolder">{errorMessage}</p>}
                  </div>
                )}

                {/* Step 2: Reset Password */}
                {currentStep === 2 && (
                  <div className="container animate__animated animate__fadeIn">
                    <h2>Reset Your Password</h2>
                    <form onSubmit={onFinalSubmit}>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input 
                          type="password" 
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          {...register("password")} 
                        />
                        {errors.password && <small className="text-danger">{errors.password.message}</small>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input 
                          type="password" 
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          {...register("confirmPassword")} 
                        />
                        {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                      </div>

                      <div className="row d-flex justify-content-between mt-4 mb-2">
                        <button 
                          className="btn btn-secondary col-2 me-4" 
                          type="button" 
                          onClick={() => setCurrentStep(1)}
                        >
                          Back
                        </button>
                        <button 
                          className="btn btn-warning col-4 LpuLogin" 
                          type="submit"
                        >
                          Reset Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordUI;