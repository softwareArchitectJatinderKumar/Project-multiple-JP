"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './Login.module.scss';
import Cookies from 'js-cookie';
import myAppWebService from '@/services/myAppWebService';

const EditorLoginPage = () => {
    const router = useRouter();
    const params = useParams();
    
    // Form State
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Cookies.remove('authData');
        // If you have a custom session clearing function in Next.js:
        // AuthSession.clearSession();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation: Equivalent to [Validators.required, Validators.minLength(5)]
        const isEmailValid = formData.email && formData.email.length >= 5;
        const isPasswordValid = formData.password && formData.password.length >= 5;

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setLoading(true);
        try {
            // 1. Login (Base64 encoding is handled inside myAppWebService or added here if needed)
            const loginResponse = await myAppWebService.loginInternalUser(formData.email, formData.password);
            
            // 2. Save Token
            myAppWebService.saveUser(loginResponse.token);

            // 3. Get Employee Details
            const empResponse = await myAppWebService.GetEmployeeDetails();
            
            if (empResponse?.item1?.length > 0) {
                const employee = empResponse.item1[0];

                // Auth Check for specific Employee Code
                if (employee.employeeCode !== '31309') {
                    Swal.fire({
                        title: 'Not Authorised',
                        text: 'This Dashboard is only for Authorised Users!',
                        icon: 'warning',
                    });
                    setLoading(false);
                    return;
                }

                // 4. Store Cookie Data
                const userCookiesData = {
                    CandidateName: employee.employeeName,
                    UserId: employee.employeeCode,
                    Department: employee.department,
                    DepartmentName: employee.departmentName,
                    Designation: employee.department,
                    EmailId: employee.email,
                    MobileNo: employee.contactNo,
                    UserRole: "", 
                    SupervisorName: employee.department,
                    ProofNumber: employee.contactNo,
                    ProofName: 'Mobile',
                    PasswordText: formData.password,
                };

                Cookies.set('authData', JSON.stringify(userCookiesData));

                await Swal.fire({
                    text: 'Login Successful!',
                    icon: 'success',
                });

                router.push('/EditorDashboard/ManageUsers');
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            Swal.fire({
                title: 'Login Failed',
                text: 'Login details are Invalid!',
                icon: 'warning',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles['eds-login-section']}>
            <div className={styles['eds-login-container']}>
                <div className={styles['eds-login-wrapper']}>
                    
                    {/* Left Side - Image */}
                    <div className={styles['eds-login-image-col']}>
                        <div className={styles['eds-login-image-wrapper']}>
                            <img 
                                src="https://www.lpu.in/lpu-assets/images/cif/login-left.png" 
                                alt="Login Background" 
                                className={styles['eds-login-image']} 
                            />
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className={styles['eds-login-form-col']}>
                        <div className={styles['eds-login-form-wrapper']}>
                            <div className={styles['eds-login-header']}>
                                <h1 className={styles['eds-login-title']}>Editor Login</h1>
                                <p className={styles['eds-login-subtitle']}>Access your dashboard</p>
                            </div>

                            <form className={styles['eds-login-form']} onSubmit={onSubmit} autoComplete="off">
                                
                                {/* User ID (Email) Field */}
                                <div className={styles['eds-form-group']}>
                                    <label htmlFor="email" className={styles['eds-form-label']}>User ID</label>
                                    <div className={styles['eds-input-wrapper']}>
                                        <input
                                            type="text"
                                            name="email"
                                            id="UserId"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter User ID"
                                            className={`${styles['eds-form-control']} ${(submitted && formData.email.length < 5) ? styles['is-invalid'] : ''}`}
                                        />
                                        <span className={styles['eds-input-icon']}>
                                            <i className="material-icons">person</i>
                                        </span>
                                    </div>
                                    {submitted && formData.email.length < 5 && (
                                        <div className={styles['eds-error-message']}>
                                            <small>User ID is required (min 5 characters).</small>
                                        </div>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className={styles['eds-form-group']}>
                                    <label htmlFor="password" className={styles['eds-form-label']}>Password</label>
                                    <div className={styles['eds-input-wrapper']}>
                                        <input
                                            type="password"
                                            name="password"
                                            id="secretKey"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter Password"
                                            className={`${styles['eds-form-control']} ${(submitted && formData.password.length < 5) ? styles['is-invalid'] : ''}`}
                                        />
                                        <span className={styles['eds-input-icon']}>
                                            <i className="material-icons">lock</i>
                                        </span>
                                    </div>
                                    {submitted && formData.password.length < 5 && (
                                        <div className={styles['eds-error-message']}>
                                            <small>Password must be at least 5 characters long.</small>
                                        </div>
                                    )}
                                </div>

                                <div className={styles['eds-form-actions']}>
                                    <button 
                                        type="submit" 
                                        className={styles['eds-btn-primary']} 
                                        disabled={loading}
                                    >
                                        <span>{loading ? 'Processing...' : 'Login'}</span>
                                        <i className="material-icons">arrow_forward</i>
                                    </button>
                                </div>
                            </form>

                            <div className={styles['eds-login-footer']}>
                                <p className={styles['eds-footer-text']}>Restricted access for authorized personnel only</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EditorLoginPage;