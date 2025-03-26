import lockedProfile from "../assets/lockedProfile.png"

const LockedProfile = () => {
    
    return (
        <div className="flex flex-col items-center justify-center space-y-6 mt-10">
            <img src={lockedProfile} alt="lockedProfile" className="h-[200px] w-auto" />
            <p className="text-gray-950 text-4xl text-center">Subscribe to see their picks</p>
        </div>
    );
}

export default LockedProfile;