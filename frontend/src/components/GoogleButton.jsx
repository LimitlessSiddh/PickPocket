import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebase_auth } from '../../firebase';


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
        <button onClick={handleGoogleAuth}>Sign in with Google</button>
    );
}

export default GoogleSignButton;
