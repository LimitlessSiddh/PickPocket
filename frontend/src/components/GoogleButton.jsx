import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebase_auth } from '../../firebase';
import google_img from "../assets/google_logo.png";


const GoogleSignButton = ({ setUser, setError }) => {
    const navigate = useNavigate();

    const handleGoogleAuth = async () =>{
        try{
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(firebase_auth, provider)

            const idToken = await result.user.getIdToken();

            const response = await axios.post(
                "http://localhost:5002/api/auth/googleAuth",
                { token: idToken },
                { withCredentials: true }
            );

            const backend_response = response.data;

            if (backend_response.success){
                const user = backend_response.user;
                setUser(user);
                navigate("/profile")

            } else {
                console.log("failed google login after backend response");
                

            } 



        } catch (error){
            console.log("Google Auth Error", error);
            setError(error);
        }
    }
    return (
        <button onClick={handleGoogleAuth}
        className="flex items-center justify-center p-3">
            <img
            className='w-auto h-8 hover: transition-transform duration-500 ease-in-out transform hover:scale-[1.2]'
            src={google_img}
            alt="Google sign in"
             />
        </button>
    );
}

export default GoogleSignButton;
