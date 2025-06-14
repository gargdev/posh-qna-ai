// import { useState, useEffect } from 'react';
// import axios from 'axios';

// interface User {
//   googleId: string;
//   displayName: string;
//   email: string;
// }

// const Navbar = () => {
//   const [user, setUser] = useState<User | null>(null);

//   // Fetch user data on mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/auth/user', {
//           withCredentials: true,
//         });
//         setUser(response.data.user);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogin = () => {
//     // Redirect to Google OAuth endpoint
//     console.log('🔐 Redirecting to Google OAuth');
//     window.location.href = 'http://localhost:4000/api/auth/google';
//   };

// //   const handleLogout = async () => {
// //     try {
// //       await axios.get('http://localhost:4000/api/auth/logout', {
// //         withCredentials: true,
// //       });
// //       setUser(null);
// //     } catch (error) {
// //       console.error('Error logging out:', error);
// //     }
// //   };

// const handleLogout = async () => {
//     try {
//       await axios.get('http://localhost:4000/api/auth/logout', {
//         withCredentials: true,
//       });
//       // Fetch user again to confirm logout
//       const response = await axios.get('http://localhost:4000/api/auth/user', {
//         withCredentials: true,
//       });
//       setUser(response.data.user); // Should be null
//       console.log('✅ Logged out successfully');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <div className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 flex justify-between items-center shadow-md z-10">
//       <h1 className="text-lg font-bold">POSH Q&A</h1>
//       {user ? (
//         <div className="flex items-center gap-2">
//           <span className="text-sm">Welcome, {user.displayName}</span>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={handleLogin}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           Login with Google
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navbar;


import { useApp } from '../contexts/AppContext';
import axios from 'axios';

// interface User {
//   googleId: string;
//   displayName: string;
//   email: string;
// }

const Navbar = () => {
  const { user, loading, refreshUser } = useApp();

  const handleLogin = () => {
    console.log('🔐 Redirecting to Google OAuth');
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:4000/api/auth/logout', {
        withCredentials: true,
      });
      await refreshUser();
      console.log('✅ Logged out successfully');
    } catch (error: unknown) {
      console.error('Error logging out:', error);
      await refreshUser();
    }
  };

  if (loading) {
    return <div className="bg-gray-800 text-white p-4">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 flex justify-between items-center shadow-md z-10">
      <h1 className="text-lg font-bold">POSH Q&A</h1>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">Welcome, {user.displayName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login with Google
        </button>
      )}
    </div>
  );
};

export default Navbar;