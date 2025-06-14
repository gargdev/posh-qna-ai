// import { useState, useEffect } from 'react';
// import AdminLogin from './adminComponents/AdminLogin';
// import AdminFileUpload from './adminComponents/AdminFileUpload';
// import AdminCreateOrganization from './adminComponents/AdminCreateOrganization';

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
//     fetchPdfList(); // Refresh PDF list on upload
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
          
//           <h1 className="text-2xl font-bold">Admin PDF Upload</h1>
//           <button
//             className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//         <AdminFileUpload onUploadSuccess={handleUploadSuccess} />
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

import { useState, useEffect } from 'react';
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <AdminCreateOrganization />
        <AdminFileUpload onUploadSuccess={handleUploadSuccess} />
        <AdminSubscriptions />
        <div className="mt-8 w-full">
          <h2 className="text-lg font-semibold mb-2">Uploaded PDFs</h2>
          {pdfList.length === 0 ? (
            <p className="text-gray-500">No PDFs uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pdfList.map((pdf, idx) => (
                <li
                  key={idx}
                  className="py-2 flex justify-between items-center"
                >
                  <span>{pdf.filename}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(pdf.uploadedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;