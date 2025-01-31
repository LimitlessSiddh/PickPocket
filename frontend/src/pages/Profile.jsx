const Profile = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white p-6">
        <div className="bg-secondary p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-accent1">Your Profile</h2>
          <p className="text-lg text-accent2 mt-2">Track your betting performance</p>
  
          <div className="mt-6 p-4 bg-primary rounded-lg shadow-md">
            <p className="text-xl font-semibold">Total Bets: <span className="text-accent1">125</span></p>
            <p className="text-xl font-semibold">Winning Percentage: <span className="text-accent1">+12.5%</span></p>
            <p className="text-xl font-semibold">ROI: <span className="text-accent2">+10%</span></p>
          </div>
  
          <button className="mt-6 bg-accent1 text-black px-6 py-2 rounded-lg text-lg font-semibold hover:bg-accent2 transition">
            Edit Profile
          </button>
        </div>
      </div>
    );
  };
  
  export default Profile;
  