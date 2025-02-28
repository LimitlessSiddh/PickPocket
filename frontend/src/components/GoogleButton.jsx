import React from 'react';
import useNavigate from 'react-router-dom';
import { auth, googleProvider } from "firebase";
import Navbar from './Navbar';

// need to make the account and add the key and wrap 

const GoogleButton = () => {
    const navigate = useNavigate();
    const handleGoogleAuth = async () =>{
        try{
            const response = await auth.signInWithPopup(googleProvider);
            console.log("Google Auth Response", response);
            const user = response.user;
            const token = await user.getIdToken();

            // send token to backend to check if worked

            navigate('/profile');

        } catch (error){
            console.log("Google Auth Error", error);
        }
    }
    return (
        <button onClick={handleGoogleAuth}>Sign in with Google</button>
    );
}

export default GoogleButton;
