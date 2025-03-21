import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, setUser }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a192f] text-whitesmoke z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="text-2xl font-bold text-white hover: transition-transform duration-500 ease-in-out transform hover:scale-[1.1]">
          <Link to="/" onClick={(): void => setMenuOpen(false)}>PickPocket</Link>
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={(): void => setMenuOpen(!menuOpen)}
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover: transition-transform duration-500 ease-in-out transform hover:scale-[1.2]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <nav
          className={`md:flex items-center gap-6 ${menuOpen ? "block absolute bg-[#0a192f] w-full left-0 top-full py-4 transition-all duration-1000 ease-in-out" : "hidden md:block"}`}
        >
          <Link
            onClick={(): void => setMenuOpen(false)}
            to="/leaderboard"
            className="text-white text-lg hover:text-gray-400 transition block px-4 py-2"
          >
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link
                onClick={(): void => setMenuOpen(false)}
                to={`/${user.username}`}
                className="text-white text-lg hover:text-gray-400 transition block px-4 py-2"
              >
                MyProfile
              </Link>
              <Link
                onClick={(): void => setMenuOpen(false)}
                to={"/betting"}
                className="text-white text-lg hover:text-gray-400 transition block px-4 py-2"
              >
                Bets
              </Link>

              <Link
                onClick={(): void => setMenuOpen(false)}
                to="/subscriptions"
                className="text-white text-lg hover:text-gray-400 transition block px-4 py-2"
              >
                Subscriptions
              </Link>
              <button
                onClick={(): void => { handleLogout(); setMenuOpen(false) }}
                className="text-red-600 text-lg hover:text-red-900 transition block px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              onClick={(): void => setMenuOpen(false)}
              to="/login"
              className="text-white text-lg hover:text-gray-400 transition block px-4 py-2"
            >
              Login
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;