import React from 'react';
import useNavigate from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';


const GoogleSignButton = ({ setUser, setError }) => {
    const navigate = useNavigate();

    const handleGoogleAuth = async () =>{
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth();

            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const response = await axios.post(
                "http://localhost:5002/api/auth/google",
                { token: token },
                { withCredentials: true }
            );

            const backend_response = response.data;

            if (backend_response.success){
                setUser(backend_response.user);
                navigate("/profile")

            } else {
                console.log("failed google login after backend response");

            } 



        } catch (error){
            console.log("Google Auth Error", error);
        }
    }
    return (
        <button onClick={handleGoogleAuth}>Sign in with Google</button>
    );
}

export default GoogleButton;
