// import { useState, type FormEvent } from 'react';

// interface AdminLoginProps {
//   onLogin: () => void; // Callback to trigger on successful login
// }

// const AdminLogin = ({ onLogin }: AdminLoginProps) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginError, setLoginError] = useState<string | null>(null);

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoginError(null);
//     try {
//       const res = await fetch('http://localhost:4000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Login failed');
//       onLogin(); // Trigger parent callback
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setLoginError(err.message || 'Login failed.');
//       } else {
//         setLoginError('Login failed.');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
//       <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xs">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="rounded-xl border border-gray-300 p-2"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="rounded-xl border border-gray-300 p-2"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
//         >
//           Login
//         </button>
//         {loginError && <p className="text-red-600 text-center">{loginError}</p>}
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

// "use client"

// import { useState, type FormEvent } from "react"
// import { Lock, Mail, LogIn, AlertCircle } from "lucide-react"

// interface AdminLoginProps {
//   onLogin: () => void
// }

// const AdminLogin = ({ onLogin }: AdminLoginProps) => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [loginError, setLoginError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     setLoginError(null)
//     setIsLoading(true)

//     try {
//       const res = await fetch("http://localhost:4000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || "Login failed")
//       onLogin()
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setLoginError(err.message || "Login failed.")
//       } else {
//         setLoginError("Login failed.")
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
//             <Lock className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
//           <p className="text-gray-600">Sign in to access the admin dashboard</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Email Field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <LogIn className="w-5 h-5" />
//               )}
//               {isLoading ? "Signing in..." : "Sign In"}
//             </button>

//             {/* Error Message */}
//             {loginError && (
//               <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                 <p className="text-red-800 font-medium">{loginError}</p>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminLogin

import { useState, type FormEvent } from 'react';
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message || 'Login failed.');
      } else {
        setLoginError('Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm font-medium">{loginError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure admin access • Protected by encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;