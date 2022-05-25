

/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import DashboardHeader from '../Dashboard/Sheard/DashboardHeader';
import './auth.css';
const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShow = () => setShowPassword(!showPassword);
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [open, setOpen] = useState(false);
    const { register, reset, handleSubmit } = useForm();
    const onSubmit = data => {
        fetch(`http://18.142.184.204:7000/users/change-password`, {
            method: 'PUT',
            headers: {
                "access-control-allow-origin": "*",
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {reset()
                // console.log(data.user)
                if (data?.error) {
                    setError(data?.error?.password);
                }
                if (data?.message) {
                    setOpen(true)
                    setError(false)
                    setSuccess(data.message)
                    window.localStorage.setItem("user", JSON.stringify(data?.data))
                    window.location.replace('/dashboard/dashboard')
                }
            })
    }
    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
        }, 7000);
    }, [error])
    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
        }, 7000);
    }, [open]);
    return (
        <>
            <DashboardHeader title="Change Password" />
            <div className="auth-container change-password-sections">
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={10} md={4} style={{ marginTop: "90px" }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            {error && <Grid item xs={12} >
                                <div>
                                    <Alert severity="error" timeout={5000} md={6}>{error}</Alert>
                                </div>
                            </Grid>}
                            {success && <Grid item xs={12} timeout={5000} md={6}>
                                <div>
                                    <Alert severity="success" timeout={5000} md={6}> {success}</Alert>
                                </div>
                            </Grid>}
                        </Grid>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row password-field-passion">
                                <label htmlFor="old-password">Old Password</label>
                                <input autoComplete="off"{...register("oldPass", { required: true, min: 1 })} type={showPassword ? "text" : "password"} placeholder={"Old Password"} required />
                                <div className='icon-svg-path'>
                                    {showPassword ?
                                        <span onClick={handleShow}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        </span> :
                                        <span onClick={handleShow}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg></span>
                                    }
                                </div>
                            </div>
                            <div className="row password-field-passion">
                                <label htmlFor="new-password">New Password</label>
                                <input autoComplete="off"{...register("newPass",{ required: true, min: 1 })} type={showPassword ? "text" : "password"} id="new-password" placeholder={"New Password"} required />
                                <div className='icon-svg-path'>
                                    {showPassword ?
                                        <span onClick={handleShow}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        </span> :
                                        <span onClick={handleShow}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg></span>
                                    }
                                </div>
                            </div>
                            <div className="row password-field-passion">
                                <label htmlFor="confirmPass">New Password</label>
                                <input autoComplete="off"{...register("confirmPass", { required: true, min: 1 })} type={showPassword ? "text" : "password"}placeholder={"Confirm Password"} required />
                                <div className='icon-svg-path'>
                                    {showPassword ?
                                        <span onClick={handleShow}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        </span> :
                                        <span onClick={handleShow}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg></span>
                                    }
                                </div>
                            </div>
                            <button className="changePass-btn" type="submit">Update Password</button>
                        </form>
                    </Grid>
                </Grid>

            </div>
        </>
    );
};

export default ChangePassword;