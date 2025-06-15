// import { useState, useEffect, type FormEvent } from 'react';
// import axios from 'axios';
// import ProgressBar from '@ramonak/react-progress-bar';

// const AdminSubscriptions = () => {
//   const [emailInput, setEmailInput] = useState('');
//   const [subscriptions, setSubscriptions] = useState<{ email: string; createdAt: string }[]>([]);
//   const [status, setStatus] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number>(0); // New state
//   const [isUploading, setIsUploading] = useState(false);

//   const fetchSubscriptions = async () => {
//     try {
//       const res = await axios.get('http://localhost:4000/api/subscription/list', {
//         withCredentials: true,
//       });
//       setSubscriptions(res.data);
//     } catch {
//       // Ignore errors silently
//     }
//   };

//   useEffect(() => {
//     fetchSubscriptions();
//   }, []);

//   const handleAddEmail = async (e: FormEvent) => {
//     e.preventDefault();
//     setStatus(null);
//     setError(null);

//     if (!emailInput.trim()) {
//       setError('Email is required');
//       return;
//     }

//     try {
//       await axios.post(
//         'http://localhost:4000/api/subscription/add',
//         { email: emailInput.trim().toLowerCase() },
//         { withCredentials: true },
//       );
//       setStatus('Email added successfully!');
//       setEmailInput('');
//       fetchSubscriptions();
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || 'Failed to add email');
//       } else {
//         setError('Failed to add email');
//       }
//     }
//   };

//   const handleRemoveEmail = async (email: string) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/subscription/remove/${email}`, {
//         withCredentials: true,
//       });
//       fetchSubscriptions();
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || 'Failed to remove email');
//       } else {
//         setError('Failed to remove email');
//       }
//     }
//   };


//   // Handle CSV upload
//   const handleCsvUpload = async (e: FormEvent) => {
//     e.preventDefault();
//     setStatus(null);
//     setError(null);
//     setIsUploading(true);
//     setUploadProgress(0);

//     if (!csvFile) {
//       setError('Please select a CSV file');
//       setIsUploading(false);
//       return;
//     }

//     if (!csvFile.name.toLowerCase().endsWith('.csv')) {
//       setError('Only CSV files are allowed');
//       setIsUploading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('csvFile', csvFile);

//     try {
//       const res = await axios.post('http://localhost:4000/api/subscription/upload-csv', formData, {
//         withCredentials: true,
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(percentCompleted);
//           }
//         },
//       });
//       setStatus(res.data.message);
//       setCsvFile(null);
//       fetchSubscriptions();
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || 'Failed to upload CSV');
//         if (err.response?.data?.details) {
//           setError(`${err.response.data.error}: ${err.response.data.details.join(', ')}`);
//         }
//       } else {
//         setError('Failed to upload CSV');
//       }
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // Download sample CSV
//   const downloadSampleCsv = () => {
//     const sampleCsv = `name,email\nJohn Doe,john.doe@gmail.com\nJane Smith,jane.smith@gopratle.com`;
//     const blob = new Blob([sampleCsv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'sample-subscribers.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // State for CSV file
//   const [csvFile, setCsvFile] = useState<File | null>(null);

//   return (
//     <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-6">
//       <h2 className="text-xl font-bold mb-4">Manage Subscriptions</h2>
//       <form onSubmit={handleAddEmail} className="flex flex-col gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Add Subscriber Email</label>
//           <div className="flex gap-2">
//             <input
//               type="email"
//               value={emailInput}
//               onChange={(e) => setEmailInput(e.target.value)}
//               className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
//               placeholder="e.g., user@gmail.com"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//         {status && <p className="text-green-600 mt-2">{status}</p>}
//         {error && <p className="text-red-600 mt-2">{error}</p>}
//       </form>
//       {/* CSV Upload */}
//       <form onSubmit={handleCsvUpload} className="flex flex-col gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Upload Subscriber CSV (Format: "name,email" columns)
//           </label>
//           <div className="flex flex-col gap-2">
//             <button
//               type="button"
//               onClick={downloadSampleCsv}
//               className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 w-fit"
//             >
//               Download Sample CSV
//             </button>
//             <div className="flex gap-2">
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
//                 className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
//                 disabled={isUploading}
//               />
//               <button
//                 type="submit"
//                 className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
//                 disabled={isUploading}
//               >
//                 Upload CSV
//               </button>
//             </div>
//             {isUploading && (
//               <ProgressBar
//                 completed={uploadProgress}
//                 bgColor="#10B981"
//                 height="20px"
//                 labelColor="#ffffff"
//                 className="mt-2"
//               />
//             )}
//           </div>
//         </div>
//         {status && <p className="text-green-600 mt-2">{status}</p>}
//         {error && <p className="text-red-600 mt-2">{error}</p>}
//       </form>


//       <div className="mt-8">
//         <h3 className="text-lg font-semibold mb-2">Subscribed Emails</h3>
//         {subscriptions.length === 0 ? (
//           <p className="text-gray-500">No subscribed emails yet.</p>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {subscriptions.map((sub, idx) => (
//               <li key={idx} className="py-2 flex justify-between items-center">
//                 <span>{sub.email}</span>
//                 <div>
//                   <span className="text-sm text-gray-500 mr-4">
//                     {new Date(sub.createdAt).toLocaleString()}
//                   </span>
//                   <button
//                     onClick={() => handleRemoveEmail(sub.email)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminSubscriptions;

// "use client"

// import { useState, useEffect, type FormEvent } from "react"
// import axios from "axios"
// import { Mail, Plus, Download, Upload, Trash2, Users, CheckCircle, AlertCircle, FileText } from "lucide-react"

// const AdminSubscriptions = () => {
//   const [emailInput, setEmailInput] = useState("")
//   const [subscriptions, setSubscriptions] = useState<{ email: string; createdAt: string }[]>([])
//   const [status, setStatus] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [uploadProgress, setUploadProgress] = useState<number>(0)
//   const [isUploading, setIsUploading] = useState(false)
//   const [csvFile, setCsvFile] = useState<File | null>(null)

//   const fetchSubscriptions = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/subscription/list", {
//         withCredentials: true,
//       })
//       setSubscriptions(res.data)
//     } catch {
//       // Ignore errors silently
//     }
//   }

//   useEffect(() => {
//     fetchSubscriptions()
//   }, [])

//   const handleAddEmail = async (e: FormEvent) => {
//     e.preventDefault()
//     setStatus(null)
//     setError(null)

//     if (!emailInput.trim()) {
//       setError("Email is required")
//       return
//     }

//     try {
//       await axios.post(
//         "http://localhost:4000/api/subscription/add",
//         { email: emailInput.trim().toLowerCase() },
//         { withCredentials: true },
//       )
//       setStatus("Email added successfully!")
//       setEmailInput("")
//       fetchSubscriptions()
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || "Failed to add email")
//       } else {
//         setError("Failed to add email")
//       }
//     }
//   }

//   const handleRemoveEmail = async (email: string) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/subscription/remove/${email}`, {
//         withCredentials: true,
//       })
//       fetchSubscriptions()
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || "Failed to remove email")
//       } else {
//         setError("Failed to remove email")
//       }
//     }
//   }

//   const handleCsvUpload = async (e: FormEvent) => {
//     e.preventDefault()
//     setStatus(null)
//     setError(null)
//     setIsUploading(true)
//     setUploadProgress(0)

//     if (!csvFile) {
//       setError("Please select a CSV file")
//       setIsUploading(false)
//       return
//     }

//     if (!csvFile.name.toLowerCase().endsWith(".csv")) {
//       setError("Only CSV files are allowed")
//       setIsUploading(false)
//       return
//     }

//     const formData = new FormData()
//     formData.append("csvFile", csvFile)

//     try {
//       const res = await axios.post("http://localhost:4000/api/subscription/upload-csv", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
//             setUploadProgress(percentCompleted)
//           }
//         },
//       })
//       setStatus(res.data.message)
//       setCsvFile(null)
//       fetchSubscriptions()
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || "Failed to upload CSV")
//         if (err.response?.data?.details) {
//           setError(`${err.response.data.error}: ${err.response.data.details.join(", ")}`)
//         }
//       } else {
//         setError("Failed to upload CSV")
//       }
//     } finally {
//       setIsUploading(false)
//       setUploadProgress(0)
//     }
//   }

//   const downloadSampleCsv = () => {
//     const sampleCsv = `name,email\nJohn Doe,john.doe@gmail.com\nJane Smith,jane.smith@gopratle.com`
//     const blob = new Blob([sampleCsv], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "sample-subscribers.csv"
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   // Custom Progress Bar Component
//   const ProgressBar = ({ progress }: { progress: number }) => (
//     <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//       <div
//         className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 ease-out rounded-full"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   )

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-8">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
//           <Users className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">Manage Subscriptions</h2>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Add Single Email */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <Mail className="w-5 h-5" />
//             Add Single Subscriber
//           </h3>

//           <form onSubmit={handleAddEmail} className="space-y-4">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Email Address</label>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <input
//                   type="email"
//                   value={emailInput}
//                   onChange={(e) => setEmailInput(e.target.value)}
//                   className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
//                   placeholder="e.g., user@gmail.com"
//                 />
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-100 transition-all duration-200 flex items-center gap-2 font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* CSV Upload */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Bulk Upload (CSV)
//           </h3>

//           <div className="space-y-4">
//             <button
//               type="button"
//               onClick={downloadSampleCsv}
//               className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
//             >
//               <Download className="w-4 h-4" />
//               Download Sample CSV
//             </button>

//             <form onSubmit={handleCsvUpload} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">Upload CSV File</label>
//                 <div className="flex flex-col gap-3">
//                   <input
//                     type="file"
//                     accept=".csv"
//                     onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
//                     className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     disabled={isUploading}
//                   />
//                   <button
//                     type="submit"
//                     disabled={isUploading || !csvFile}
//                     className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
//                   >
//                     <Upload className="w-4 h-4" />
//                     {isUploading ? "Uploading..." : "Upload CSV"}
//                   </button>
//                 </div>
//               </div>

//               {isUploading && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Upload Progress</span>
//                     <span>{uploadProgress}%</span>
//                   </div>
//                   <ProgressBar progress={uploadProgress} />
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Status Messages */}
//       {status && (
//         <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mt-6">
//           <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//           <p className="text-green-800 font-medium">{status}</p>
//         </div>
//       )}
//       {error && (
//         <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mt-6">
//           <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//           <p className="text-red-800 font-medium">{error}</p>
//         </div>
//       )}

//       {/* Subscriptions List */}
//       <div className="mt-8">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Subscribed Emails ({subscriptions.length})
//           </h3>
//         </div>

//         {subscriptions.length === 0 ? (
//           <div className="text-center py-12">
//             <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No subscribed emails yet.</p>
//             <p className="text-gray-400 text-sm">Add your first subscriber above!</p>
//           </div>
//         ) : (
//           <div className="bg-gray-50 rounded-2xl p-4">
//             <div className="space-y-2 max-h-96 overflow-y-auto">
//               {subscriptions.map((sub, idx) => (
//                 <div
//                   key={idx}
//                   className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200"
//                 >
//                   <div className="flex items-center gap-3 mb-2 sm:mb-0">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <Mail className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{sub.email}</p>
//                       <p className="text-sm text-gray-500">Added {new Date(sub.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleRemoveEmail(sub.email)}
//                     className="self-start sm:self-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AdminSubscriptions

import { useState, useEffect, type FormEvent } from 'react';
import { Mail, Plus, X, Download, Upload, Users, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const AdminSubscriptions = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscriptions, setSubscriptions] = useState<{ email: string; createdAt: string }[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/subscription/list', {
        withCredentials: true,
      });
      setSubscriptions(res.data);
    } catch {
      // Ignore errors silently
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddEmail = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!emailInput.trim()) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/subscription/add',
        { email: emailInput.trim().toLowerCase() },
        { withCredentials: true },
      );
      setStatus('Email added successfully!');
      setEmailInput('');
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to add email');
      } else {
        setError('Failed to add email');
      }
    }
  };

  const handleRemoveEmail = async (email: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/subscription/remove/${email}`, {
        withCredentials: true,
      });
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to remove email');
      } else {
        setError('Failed to remove email');
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.csv')) {
        setCsvFile(droppedFile);
        setError(null);
      } else {
        setError('Please select a CSV file only.');
      }
    }
  };

  const handleCsvUpload = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    if (!csvFile) {
      setError('Please select a CSV file');
      setIsUploading(false);
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const res = await axios.post('http://localhost:4000/api/subscription/upload-csv', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      setStatus(res.data.message);
      setCsvFile(null);
      fetchSubscriptions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to upload CSV');
        if (err.response?.data?.details) {
          setError(`${err.response.data.error}: ${err.response.data.details.join(', ')}`);
        }
      } else {
        setError('Failed to upload CSV');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadSampleCsv = () => {
    const sampleCsv = `name,email\nJohn Doe,john.doe@gmail.com\nJane Smith,jane.smith@gopratle.com`;
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Subscriptions</h2>
          <p className="text-sm text-gray-600">Add and manage subscriber emails</p>
        </div>
      </div>

      {/* Add Single Email */}
      <form onSubmit={handleAddEmail} className="space-y-4 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Add Subscriber Email
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., user@gmail.com"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail(e)}
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* CSV Upload Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Bulk Upload CSV
          </label>
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample</span>
          </button>
        </div>

        {/* CSV Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-green-400 bg-green-50'
              : csvFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="space-y-3">
            {csvFile ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{csvFile.name}</p>
                  <p className="text-sm text-gray-500">Ready to upload</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Drop CSV file here</p>
                  <p className="text-sm text-gray-500">Format: name,email columns</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleCsvUpload}
          disabled={!csvFile || isUploading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Uploading CSV...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV
            </div>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {status && (
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-medium">{status}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Subscribers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Subscribers ({subscriptions.length})
          </h3>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No subscribers yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first subscriber to get started</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {subscriptions.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 truncate">{sub.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleRemoveEmail(sub.email)}
                    className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptions;