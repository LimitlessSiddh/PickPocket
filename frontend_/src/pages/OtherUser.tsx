import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OtherUser = ({ user }: OtherUserProps)=>{
    const {userName} = useParams();
    const navigate = useNavigate();
    const [wantedUser, setWantedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const getProfile = async () =>{
            try{
                if(!userName){
                    navigate("/");
                }

                const response = await axios.get(`api/${userName}`);
                if(response.status == 500){
                    navigate("/")
                }

                setWantedUser(response.data.user);
            } catch (error){
                console.log(error);
            }
        }
    })
    
    return(
        <div>

        </div>
    );

}

export default OtherUser;