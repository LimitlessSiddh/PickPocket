import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebase_auth } from '../../firebase';
import google_img from "../assets/google_logo.png";
import SetUsernameForm from './SetUserName';
import { useState } from 'react';

const GoogleButton = ({ setUser, setError }: GoogleButtonProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [showUsernameForm, setShowUsernameForm] = useState<boolean>(false);

    const handleGoogleAuth = async (): Promise<void> => {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(firebase_auth, provider)

            const idToken = await result.user.getIdToken();

            const response = await axios.post(
                "http://localhost:5002/api/auth/googleAuth",
                { token: idToken },
                { withCredentials: true }
            );

            const backend_response = response.data;

            if (backend_response.success) {
                const user : User = backend_response.user;
                setUser(user);

                if(user.username){
                    navigate("/profile");
                } else {
                    setEmail(user.email);
                    setShowUsernameForm(true);
                }

            } else {
                console.log("failed google login after backend response");


            }



        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
                setError("Error logging it. Please try again");
            }
            console.log("Unknown Error", error);

        }
    }
    return (
        <>
        {!showUsernameForm ? (
            <button onClick={handleGoogleAuth} className="flex items-center justify-center p-3">
                <img
                    className='w-auto h-8 hover: transition-transform duration-500 ease-in-out transform hover:scale-[1.2]'
                    src={google_img}
                    alt="Google sign in"
                />
            </button>
        ) : (
            <SetUsernameForm email={email} setUser={setUser} setError={setError} />
        )}
    </>
    );
}

export default GoogleButton;
