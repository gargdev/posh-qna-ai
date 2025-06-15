// import { useState, type ChangeEvent } from 'react';

// interface AdminFileUploadProps {
//   onUploadSuccess: (chunks: number | null) => void; // Callback for successful upload
// }

// const AdminFileUpload = ({ onUploadSuccess }: AdminFileUploadProps) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [status, setStatus] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [chunks, setChunks] = useState<number | null>(null);

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setStatus(null);
//       setChunks(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setStatus('Please select a PDF file.');
//       return;
//     }
//     setUploading(true);
//     setStatus(null);
//     setChunks(null);
//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       const res = await fetch('http://localhost:4000/api/pdf/upload', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Upload failed');
//       setStatus('Upload successful!');
//       if (data.chunks) {
//         setChunks(data.chunks);
//         onUploadSuccess(data.chunks); // Notify parent
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setStatus(err.message || 'Upload failed.');
//       } else {
//         setStatus('Upload failed.');
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={handleFileChange}
//         className="mb-4"
//       />
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
//         onClick={handleUpload}
//         disabled={!file || uploading}
//       >
//         {uploading ? 'Uploading...' : 'Upload PDF'}
//       </button>
//       {status && (
//         <p
//           className={`mt-4 ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}
//         >
//           {status}
//         </p>
//       )}
//       {chunks !== null && (
//         <p className="mt-2 text-gray-700">
//           PDF processed into <b>{chunks}</b> chunks.
//         </p>
//       )}
//     </div>
//   );
// };

// export default AdminFileUpload;

// "use client"

// import { useState, type ChangeEvent } from "react"
// import { Upload, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react"

// interface AdminFileUploadProps {
//   onUploadSuccess: (chunks: number | null) => void
// }

// const AdminFileUpload = ({ onUploadSuccess }: AdminFileUploadProps) => {
//   const [file, setFile] = useState<File | null>(null)
//   const [status, setStatus] = useState<string | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [chunks, setChunks] = useState<number | null>(null)

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0])
//       setStatus(null)
//       setChunks(null)
//     }
//   }

//   const handleUpload = async () => {
//     if (!file) {
//       setStatus("Please select a PDF file.")
//       return
//     }
//     setUploading(true)
//     setStatus(null)
//     setChunks(null)
//     const formData = new FormData()
//     formData.append("file", file)
//     try {
//       const res = await fetch("http://localhost:4000/api/pdf/upload", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || "Upload failed")
//       setStatus("Upload successful!")
//       if (data.chunks) {
//         setChunks(data.chunks)
//         onUploadSuccess(data.chunks)
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setStatus(err.message || "Upload failed.")
//       } else {
//         setStatus("Upload failed.")
//       }
//     } finally {
//       setUploading(false)
//     }
//   }

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
//           <FileText className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">PDF Upload</h2>
//       </div>

//       <div className="space-y-6">
//         {/* File Input */}
//         <div className="space-y-4">
//           <label className="block text-sm font-semibold text-gray-700">Select PDF File</label>

//           <div className="relative">
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileChange}
//               className="w-full px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {!file && (
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center">
//                   <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-gray-500">Choose a PDF file or drag and drop</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* File Info */}
//           {file && (
//             <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//               <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-blue-900 truncate">{file.name}</p>
//                 <p className="text-sm text-blue-700">{formatFileSize(file.size)}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Upload Button */}
//         <button
//           onClick={handleUpload}
//           disabled={!file || uploading}
//           className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 focus:ring-4 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//         >
//           {uploading ? (
//             <>
//               <Loader className="w-5 h-5 animate-spin" />
//               Uploading...
//             </>
//           ) : (
//             <>
//               <Upload className="w-5 h-5" />
//               Upload PDF
//             </>
//           )}
//         </button>

//         {/* Status Messages */}
//         {status && (
//           <div
//             className={`flex items-center gap-3 p-4 rounded-xl ${
//               status.includes("successful") ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
//             }`}
//           >
//             {status.includes("successful") ? (
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//             ) : (
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             )}
//             <p className={`font-medium ${status.includes("successful") ? "text-green-800" : "text-red-800"}`}>
//               {status}
//             </p>
//           </div>
//         )}

//         {/* Chunks Info */}
//         {chunks !== null && (
//           <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <FileText className="w-4 h-4 text-purple-600" />
//             </div>
//             <div>
//               <p className="font-medium text-purple-900">PDF processed successfully!</p>
//               <p className="text-sm text-purple-700">
//                 Document split into <strong>{chunks}</strong> chunks for processing.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AdminFileUpload

import { useState, type ChangeEvent } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface AdminFileUploadProps {
  onUploadSuccess: (chunks: number | null) => void;
}

const AdminFileUpload = ({ onUploadSuccess }: AdminFileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chunks, setChunks] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setChunks(null);
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
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setStatus(null);
        setChunks(null);
      } else {
        setStatus('Please select a PDF file only.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a PDF file.');
      return;
    }
    setUploading(true);
    setStatus(null);
    setChunks(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:4000/api/pdf/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setStatus('Upload successful!');
      if (data.chunks) {
        setChunks(data.chunks);
        onUploadSuccess(data.chunks);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(err.message || 'Upload failed.');
      } else {
        setStatus('Upload failed.');
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
          <Upload className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <p className="text-sm text-gray-600">Upload PDF files for processing</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-purple-400 bg-purple-50'
            : file
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your PDF here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF files up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </div>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {status && (
        <div className={`mt-4 flex items-center space-x-2 p-4 rounded-2xl border ${
          status.includes('successful')
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          {status.includes('successful') ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <p className={`font-medium ${
            status.includes('successful') ? 'text-green-700' : 'text-red-700'
          }`}>
            {status}
          </p>
        </div>
      )}

      {chunks !== null && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <p className="text-blue-700 font-medium">
              Document processed into <span className="font-bold">{chunks}</span> chunks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFileUpload;
