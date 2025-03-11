import { useNavigate } from "react-router-dom";
import SportLogos from "../components/SportLogos";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden w-full mx-auto ">
      
      <div className="w-full flex justify-center items-center">
        <h2 className="text-3xl font-semibold text-blue-950">Welcome to PickPocket</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-1/2 mt-5 px-6 md:px-12 py-10">
        
        <h4 className="text-lg md:text-xl text-blue-950 mb-4 md:mb-0">
          Track your bets, prove your skills.
        </h4>

        <button 
          className="px-6 py-4 text-lg font-bold italic border-2 border-gray-300 bg-[#202334] text-slate-300 rounded-md 
                     transition transform hover:scale-110 hover:bg-white hover:text-[#253a4a] hover:shadow-lg 
                     active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500"
          onClick={() => navigate("/betting")}
        >
          Let's Fleece
        </button>

      </div>

      <SportLogos />

    </div>
  );
};

export default Home;