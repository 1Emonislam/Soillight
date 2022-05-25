import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo/soillightLogo.png';
import { login } from '../../management/actions/userActions';
import Loading from '../../management/Loading/Loading';
import ErrorMessage from '../../management/Message/ErrorMessage';
import SuccessMessage from '../../management/Message/SuccessMessage';
import './auth.css';
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleShow = () => setShowPassword(!showPassword);
    const navigate = useNavigate()
    const { register, reset, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, user } = userLogin;

    const onSubmit = async subData => {
        dispatch(login(subData, reset, navigate))
    };
    useEffect(() => {
        if (user?.message) {
            navigate('/dashboard/dashboard' || '/')
        }
    }, [navigate, user?.message])
    return (
        <>
            <div className="auth-container">
                <div className="logo-head"><img sx={{ display: 'block', margin: '0 auto' }} src={logo} alt="soillight logo" />

                </div>
                <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: '400' }} gutterBottom component="div">
                    Welcome Back!
                </Typography>
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Grid item xs={10} md={4} style={{ marginTop: "20px" }}>
                        {error && <ErrorMessage style={{ backgroundColor: 'red' }}>
                            {error}
                        </ErrorMessage>}
                        {user && <SuccessMessage style={{ backgroundColor: 'red' }}>
                            {user.message}
                        </SuccessMessage>}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <label htmlFor="email">Email</label>
                                <input type="email"{...register("email", { min: 0 })} autoComplete="off" placeholder="Type your email" required />
                            </div>
                            <div className="row password-field-passion">
                                <label htmlFor="password">Password</label>
                                <input autoComplete="off"{...register("password", { min: 0 })} type={showPassword ? "text" : "password"} name="password" id="password" placeholder={"Password"} required />
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
                         { loading?<Loading/>:<button className="auth-btn" type="submit">Login</button>}
                        </form>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default Login