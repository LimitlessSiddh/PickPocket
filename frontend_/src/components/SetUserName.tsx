// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SetUsernameForm = ({ email, setUser}: SetUsernameProps) => {
//   const [username, setUsername] = useState('');
//   const [error, setFormError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!username) {
//       setFormError('Username is required');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5002/api/auth/setUsername", {
//         email,
//         username,
//       });

//       const result = response.data;

//       if (result.success) {
//         setUser(result.user);
//         navigate("/profile");  // Redirect to the profile page after successful username set
//       } else {
//         setFormError(result.message); // Show error message if the username is invalid
//       }
//     } catch (error) {
//       console.error("Error setting username:", error);
//       setFormError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
//       >
//         <h2 className="text-xl font-semibold text-center">Set Your Username</h2>
        
//         <div>
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="mt-1 px-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             required
//             placeholder="Choose a unique username"
//           />
//         </div>
        
//         {error && <p className="text-red-500 text-xs">{error}</p>}
        
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className={`mt-4 px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none ${loading ? 'bg-blue-300' : 'hover:bg-blue-700'}`}
//             disabled={loading}
//           >
//             {loading ? "Setting..." : "Set Username"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SetUsernameForm;