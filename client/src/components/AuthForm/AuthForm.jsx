import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserContext } from '../../UserContext';

import './AuthForm.scss';

function AuthForm({ type, closeModal }) {
    const { loginUser } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(type === 'login');
    const [isRoleSelection, setIsRoleSelection] = useState(false);
    const [registerData, setRegisterData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onLoginSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email: data.email, password: data.password });
            loginUser(response.data);
            closeModal();
        } catch (error) {
            console.error("Login failed:", error.response.data);
        }
    };

    const onRegisterSubmit = (data) => {
        setRegisterData({ name: `${data.firstName} ${data.lastName}`, email: data.email, password: data.password });
        setIsRoleSelection(true);
    };

    const onRoleSubmit = async (roleData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { ...registerData, role: roleData.role });
            loginUser(response.data);
            closeModal();
        } catch (error) {
            setErrorMessage(error.response.data.message || "Registration failed.");
            console.error("Registration failed:", error.response);
        }
    };

    return (
        <div className="auth-overlay" onClick={closeModal}>
            <div className="auth-container" onClick={(e) => e.stopPropagation()}>
                <div className="left">
                    <div></div>
                </div>
                <div className="right">
                    {isRoleSelection ? (
                        <RoleSelection
                            onSubmit={onRoleSubmit}
                            errorMessage={errorMessage}
                            setErrorMessage={setErrorMessage}
                        />
                    ) : (
                        <>
                            <label htmlFor="form">{isLogin ? "Login to your Bhansa Account" : "Register for a Bhansa Account"}</label>

                            <form onSubmit={handleSubmit(isLogin ? onLoginSubmit : onRegisterSubmit)}>
                                {!isLogin && (
                                    <div className="name-fields">
                                        <div>
                                            <label><h5>First Name</h5></label>
                                            <input {...register('firstName', { required: "First name is required" })} type='text' placeholder='' />
                                            {errors.firstName && <p style={{ color: "red" }}>{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label><h5>Last Name</h5></label>
                                            <input {...register('lastName', { required: "Last name is required" })} type='text' placeholder='' />
                                            {errors.lastName && <p style={{ color: "red" }}>{errors.lastName.message}</p>}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label><h5>Email</h5></label>
                                    <input {...register('email', {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email format"
                                        }
                                    })} type='email' placeholder='' />
                                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label><h5>Password</h5></label>
                                    <input {...register('password', {
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
                                            message: "Password must have at least one number, one uppercase letter, and one special character"
                                        }
                                    })} type='password' placeholder='' />
                                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                                </div>

                                {isLogin && (
                                    <div className="remember-me">
                                        <input {...register('rememberMe')} type='checkbox' id='remember-me' />
                                        <label htmlFor="remember-me">Remember me</label>
                                    </div>
                                )}

                                <div>
                                    <button className="btn-secondary" type='submit'>{isLogin ? 'Login' : 'Register'}</button>
                                    {isLogin ? (
                                        <span>Don't have an account? <a onClick={() => setIsLogin(false)} className='auth-link'>Sign up</a></span>
                                    ) : (
                                        <span>Already have an account? <a onClick={() => setIsLogin(true)} className='auth-link'>Login</a></span>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function RoleSelection({ onSubmit, errorMessage, setErrorMessage }) {
    const { register, handleSubmit } = useForm();

    return (
        <form className='role-selection' onSubmit={handleSubmit(onSubmit)}>
            <label>How do you plan to use this account?</label>
            <div className='role-options'>
                <div className='role-option'>
                    <input type="radio" id="food-enthusiast" value="Food Enthusiast" {...register('role', { required: true })} />
                    <label htmlFor="food-enthusiast">
                        <p>I want to browse, search and rate recipes.</p>
                    </label>
                </div>
                <div className='role-option'>
                    <input type="radio" id="cook" value="Cook" {...register('role', { required: true })} />
                    <label htmlFor="cook">
                        <p>I want to add and manage new recipes.</p>
                    </label>
                </div>
                <div className='role-option'>
                    <input type="radio" id="meal-planner" value="Meal Planner" {...register('role', { required: true })} />
                    <label htmlFor="meal-planner">
                        <p>I want to add and manage new meal plans.</p>
                    </label>
                </div>
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button className="btn-secondary" type="submit">Complete Registration</button>
        </form>
    );
}

export default AuthForm;
