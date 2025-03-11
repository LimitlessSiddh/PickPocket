import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a192f] text-whitesmoke z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold text-white">
          <Link to="/">PickPocket</Link>
        </div>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/profile" className="text-white hover:text-gray-300 transition">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white text-lg hover:text-gray-300 transition">
              Login
            </Link>
          )}
          <Link to="/leaderboard" className="text-white text-lg hover:text-gray-300 transition">
            Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;