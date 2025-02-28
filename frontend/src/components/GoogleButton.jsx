import {GoogleLogin} from '@react-oauth/google';
import useNavigate from 'react-router-dom';

// need to make the account and add the key and wrap 

const GoogleButton = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GoogleLogin
                onSuccess={() => {navigate("/")}}
                onError={() => console.log("failed")}
                auto_select={true}
            />
        </div>
    );
}

export default GoogleButton;
