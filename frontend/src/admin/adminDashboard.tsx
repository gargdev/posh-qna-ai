// import { useState, useEffect } from 'react';
// import AdminLogin from './adminComponents/AdminLogin';
// import AdminFileUpload from './adminComponents/AdminFileUpload';
// import AdminCreateOrganization from './adminComponents/AdminCreateOrganization';
// import AdminSubscriptions from './adminComponents/AdminSubscriptions'; 

// const AdminDashboard = () => {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [pdfList, setPdfList] = useState<
//     { filename: string; uploadedAt: string }[]
//   >([]);

//   const fetchPdfList = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/api/pdf/list', {
//         credentials: 'include',
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setPdfList(data);
//       }
//     } catch {
//       // Error intentionally ignored
//     }
//   };

//   const handleLogin = () => {
//     setLoggedIn(true);
//   };

//   const handleUploadSuccess = () => {
//     fetchPdfList();
//   };

//   const handleLogout = async () => {
//     await fetch('http://localhost:4000/api/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setLoggedIn(false);
//     setPdfList([]);
//   };

//   useEffect(() => {
//     if (loggedIn) {
//       fetchPdfList();
//     }
//   }, [loggedIn]);

//   if (!loggedIn) {
//     return <AdminLogin onLogin={handleLogin} />;
//   }

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
//       <div className="w-full max-w-xl flex flex-col items-center">
//         <div className="flex w-full justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <button
//             className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//         <AdminCreateOrganization />
//         <AdminFileUpload onUploadSuccess={handleUploadSuccess} />
//         <AdminSubscriptions />
//         <div className="mt-8 w-full">
//           <h2 className="text-lg font-semibold mb-2">Uploaded PDFs</h2>
//           {pdfList.length === 0 ? (
//             <p className="text-gray-500">No PDFs uploaded yet.</p>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {pdfList.map((pdf, idx) => (
//                 <li
//                   key={idx}
//                   className="py-2 flex justify-between items-center"
//                 >
//                   <span>{pdf.filename}</span>
//                   <span className="text-sm text-gray-500">
//                     {new Date(pdf.uploadedAt).toLocaleString()}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// "use client"

// import { useState, useEffect } from "react"
// import AdminLogin from './adminComponents/AdminLogin';
// import AdminFileUpload from './adminComponents/AdminFileUpload';
// import AdminCreateOrganization from './adminComponents/AdminCreateOrganization';
// import AdminSubscriptions from './adminComponents/AdminSubscriptions'; 
// import { LayoutDashboard, LogOut, FileText, Calendar } from "lucide-react"

// const AdminDashboard = () => {
//   const [loggedIn, setLoggedIn] = useState(false)
//   const [pdfList, setPdfList] = useState<{ filename: string; uploadedAt: string }[]>([])

//   const fetchPdfList = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/api/pdf/list", {
//         credentials: "include",
//       })
//       if (res.ok) {
//         const data = await res.json()
//         setPdfList(data)
//       }
//     } catch {
//       // Error intentionally ignored
//     }
//   }

//   const handleLogin = () => {
//     setLoggedIn(true)
//   }

//   const handleUploadSuccess = () => {
//     fetchPdfList()
//   }

//   const handleLogout = async () => {
//     await fetch("http://localhost:4000/api/logout", {
//       method: "POST",
//       credentials: "include",
//     })
//     setLoggedIn(false)
//     setPdfList([])
//   }

//   useEffect(() => {
//     if (loggedIn) {
//       fetchPdfList()
//     }
//   }, [loggedIn])

//   if (!loggedIn) {
//     return <AdminLogin onLogin={handleLogin} />
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
//                 <LayoutDashboard className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200 font-medium"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-8">
//           {/* Components */}
//           <AdminCreateOrganization />
//           <AdminFileUpload onUploadSuccess={handleUploadSuccess} />
//           <AdminSubscriptions />

//           {/* PDF List */}
//           <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">Uploaded PDFs ({pdfList.length})</h2>
//             </div>

//             {pdfList.length === 0 ? (
//               <div className="text-center py-12">
//                 <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No PDFs uploaded yet.</p>
//                 <p className="text-gray-400 text-sm">Upload your first PDF above!</p>
//               </div>
//             ) : (
//               <div className="bg-gray-50 rounded-2xl p-4">
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {pdfList.map((pdf, idx) => (
//                     <div
//                       key={idx}
//                       className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200"
//                     >
//                       <div className="flex items-center gap-3 mb-2 sm:mb-0">
//                         <div className="p-2 bg-indigo-100 rounded-lg">
//                           <FileText className="w-4 h-4 text-indigo-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md">{pdf.filename}</p>
//                           <div className="flex items-center gap-2 text-sm text-gray-500">
//                             <Calendar className="w-3 h-3" />
//                             {new Date(pdf.uploadedAt).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard

import { useState, useEffect } from 'react';
import { LogOut, FileText, Calendar, Shield } from 'lucide-react';

import AdminLogin from './adminComponents/AdminLogin';
import AdminFileUpload from './adminComponents/AdminFileUpload';
import AdminCreateOrganization from './adminComponents/AdminCreateOrganization';
import AdminSubscriptions from './adminComponents/AdminSubscriptions'; 

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pdfList, setPdfList] = useState<
    { filename: string; uploadedAt: string }[]
  >([]);

  const fetchPdfList = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/pdf/list', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPdfList(data);
      }
    } catch {
      // Error intentionally ignored
    }
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleUploadSuccess = () => {
    fetchPdfList();
  };

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setLoggedIn(false);
    setPdfList([]);
  };

  useEffect(() => {
    if (loggedIn) {
      fetchPdfList();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your organization and content</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <AdminCreateOrganization />
            <AdminFileUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AdminSubscriptions />
            
            {/* PDF List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
              </div>
              
              {pdfList.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No documents uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first PDF to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pdfList.map((pdf, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
                          <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-900 truncate">{pdf.filename}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {new Date(pdf.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="sm:hidden">
                          {new Date(pdf.uploadedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;