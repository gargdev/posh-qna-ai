// import { useState, type FormEvent } from 'react';
// import axios from 'axios';

// const AdminCreateOrganization = () => {
//   const [name, setName] = useState('');
//   const [domainInput, setDomainInput] = useState('');
//   const [domains, setDomains] = useState<string[]>([]);
//   const [organizerInput, setOrganizerInput] = useState('');
//   const [organizers, setOrganizers] = useState<string[]>([]);
//   const [status, setStatus] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleAddDomain = () => {
//     if (domainInput.trim()) {
//       const domain = domainInput.trim().toLowerCase();
//       if (!domains.includes(domain)) {
//         setDomains([...domains, domain]);
//         setDomainInput('');
//       } else {
//         setError('Domain already added');
//       }
//     }
//   };

//   const handleRemoveDomain = (domain: string) => {
//     setDomains(domains.filter((d) => d !== domain));
//   };

//   const handleAddOrganizer = () => {
//     if (organizerInput.trim()) {
//       const organizer = organizerInput.trim().toLowerCase();
//       if (!organizers.includes(organizer)) {
//         setOrganizers([...organizers, organizer]);
//         setOrganizerInput('');
//       } else {
//         setError('Organizer already added');
//       }
//     }
//   };

//   const handleRemoveOrganizer = (organizer: string) => {
//     setOrganizers(organizers.filter((o) => o !== organizer));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setStatus(null);
//     setError(null);

//     if (!name.trim() || domains.length === 0) {
//       setError('Organization name and at least one domain are required');
//       return;
//     }

//     try {
//       await axios.post(
//         'http://localhost:4000/api/organization/create',
//         { name, domains, organizers },
//         { withCredentials: true },
//       );
//       setStatus('Organization created successfully!');
//       setName('');
//       setDomains([]);
//       setOrganizers([]);
//       setDomainInput('');
//       setOrganizerInput('');
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || 'Failed to create organization');
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-6">
//       <h2 className="text-xl font-bold mb-4">Create Organization</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Organization Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 rounded-xl border border-gray-300 p-2 w-full"
//             placeholder="e.g., Zomato"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Add Domain</label>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={domainInput}
//               onChange={(e) => setDomainInput(e.target.value)}
//               className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
//               placeholder="e.g., zomato.com"
//             />
//             <button
//               type="button"
//               onClick={handleAddDomain}
//               className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//         {domains.length > 0 && (
//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Added Domains:</h3>
//             <ul className="mt-2 flex flex-wrap gap-2">
//               {domains.map((domain) => (
//                 <li key={domain} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
//                   {domain}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveDomain(domain)}
//                     className="ml-2 text-red-600 hover:text-red-800"
//                   >
//                     ×
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Add Organizer Email</label>
//           <div className="flex gap-2">
//             <input
//               type="email"
//               value={organizerInput}
//               onChange={(e) => setOrganizerInput(e.target.value)}
//               className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
//               placeholder="e.g., organizer@zomato.com"
//             />
//             <button
//               type="button"
//               onClick={handleAddOrganizer}
//               className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//         {organizers.length > 0 && (
//           <div>
//             <h3 className="text-sm font-medium text-gray-700">Added Organizers:</h3>
//             <ul className="mt-2 flex flex-wrap gap-2">
//               {organizers.map((organizer) => (
//                 <li key={organizer} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
//                   {organizer}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveOrganizer(organizer)}
//                     className="ml-2 text-red-600 hover:text-red-800"
//                   >
//                     ×
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
//         >
//           Create Organization
//         </button>
//         {status && <p className="text-green-600 mt-2">{status}</p>}
//         {error && <p className="text-red-600 mt-2">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default AdminCreateOrganization;

// "use client"

// import { useState, type FormEvent } from "react"
// import axios from "axios"
// import { Building2, Plus, X, Globe, Mail, CheckCircle, AlertCircle } from "lucide-react"

// const AdminCreateOrganization = () => {
//   const [name, setName] = useState("")
//   const [domainInput, setDomainInput] = useState("")
//   const [domains, setDomains] = useState<string[]>([])
//   const [organizerInput, setOrganizerInput] = useState("")
//   const [organizers, setOrganizers] = useState<string[]>([])
//   const [status, setStatus] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleAddDomain = () => {
//     if (domainInput.trim()) {
//       const domain = domainInput.trim().toLowerCase()
//       if (!domains.includes(domain)) {
//         setDomains([...domains, domain])
//         setDomainInput("")
//         setError(null)
//       } else {
//         setError("Domain already added")
//       }
//     }
//   }

//   const handleRemoveDomain = (domain: string) => {
//     setDomains(domains.filter((d) => d !== domain))
//   }

//   const handleAddOrganizer = () => {
//     if (organizerInput.trim()) {
//       const organizer = organizerInput.trim().toLowerCase()
//       if (!organizers.includes(organizer)) {
//         setOrganizers([...organizers, organizer])
//         setOrganizerInput("")
//         setError(null)
//       } else {
//         setError("Organizer already added")
//       }
//     }
//   }

//   const handleRemoveOrganizer = (organizer: string) => {
//     setOrganizers(organizers.filter((o) => o !== organizer))
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setStatus(null)
//     setError(null)

//     if (!name.trim() || domains.length === 0) {
//       setError("Organization name and at least one domain are required")
//       return
//     }

//     try {
//       await axios.post(
//         "http://localhost:4000/api/organization/create",
//         { name, domains, organizers },
//         { withCredentials: true },
//       )
//       setStatus("Organization created successfully!")
//       setName("")
//       setDomains([])
//       setOrganizers([])
//       setDomainInput("")
//       setOrganizerInput("")
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || "Failed to create organization")
//       }
//     }
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
//           <Building2 className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">Create Organization</h2>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Organization Name */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
//             placeholder="e.g., Zomato"
//             required
//           />
//         </div>

//         {/* Add Domain */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Globe className="w-4 h-4" />
//             Add Domain
//           </label>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="text"
//               value={domainInput}
//               onChange={(e) => setDomainInput(e.target.value)}
//               className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
//               placeholder="e.g., zomato.com"
//               onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDomain())}
//             />
//             <button
//               type="button"
//               onClick={handleAddDomain}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 flex items-center gap-2 font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Added Domains */}
//         {domains.length > 0 && (
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold text-gray-700">Added Domains:</h3>
//             <div className="flex flex-wrap gap-2">
//               {domains.map((domain) => (
//                 <div
//                   key={domain}
//                   className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2 rounded-full"
//                 >
//                   <Globe className="w-4 h-4 text-blue-600" />
//                   <span className="text-blue-800 font-medium">{domain}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveDomain(domain)}
//                     className="ml-1 p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
//                   >
//                     <X className="w-4 h-4 text-red-500 hover:text-red-700" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Add Organizer */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
//             <Mail className="w-4 h-4" />
//             Add Organizer Email
//           </label>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="email"
//               value={organizerInput}
//               onChange={(e) => setOrganizerInput(e.target.value)}
//               className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
//               placeholder="e.g., organizer@zomato.com"
//               onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOrganizer())}
//             />
//             <button
//               type="button"
//               onClick={handleAddOrganizer}
//               className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-100 transition-all duration-200 flex items-center gap-2 font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Added Organizers */}
//         {organizers.length > 0 && (
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold text-gray-700">Added Organizers:</h3>
//             <div className="flex flex-wrap gap-2">
//               {organizers.map((organizer) => (
//                 <div
//                   key={organizer}
//                   className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-full"
//                 >
//                   <Mail className="w-4 h-4 text-green-600" />
//                   <span className="text-green-800 font-medium">{organizer}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveOrganizer(organizer)}
//                     className="ml-1 p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
//                   >
//                     <X className="w-4 h-4 text-red-500 hover:text-red-700" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
//         >
//           Create Organization
//         </button>

//         {/* Status Messages */}
//         {status && (
//           <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
//             <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//             <p className="text-green-800 font-medium">{status}</p>
//           </div>
//         )}
//         {error && (
//           <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-800 font-medium">{error}</p>
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// export default AdminCreateOrganization

import { useState, type FormEvent } from 'react';
import { Building2, Globe, Mail, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminCreateOrganization = () => {
  const [name, setName] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [organizerInput, setOrganizerInput] = useState('');
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDomain = () => {
    if (domainInput.trim()) {
      const domain = domainInput.trim().toLowerCase();
      if (!domains.includes(domain)) {
        setDomains([...domains, domain]);
        setDomainInput('');
        setError(null);
      } else {
        setError('Domain already added');
      }
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  const handleAddOrganizer = () => {
    if (organizerInput.trim()) {
      const organizer = organizerInput.trim().toLowerCase();
      if (!organizers.includes(organizer)) {
        setOrganizers([...organizers, organizer]);
        setOrganizerInput('');
        setError(null);
      } else {
        setError('Organizer already added');
      }
    }
  };

  const handleRemoveOrganizer = (organizer: string) => {
    setOrganizers(organizers.filter((o) => o !== organizer));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsLoading(true);

    if (!name.trim() || domains.length === 0) {
      setError('Organization name and at least one domain are required');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/api/organization/create',
        { name, domains, organizers },
        { withCredentials: true },
      );
      setStatus('Organization created successfully!');
      setName('');
      setDomains([]);
      setOrganizers([]);
      setDomainInput('');
      setOrganizerInput('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to create organization');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Create Organization</h2>
          <p className="text-sm text-gray-600">Set up a new organization with domains and organizers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Organization Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            placeholder="e.g., Zomato Technologies"
            required
          />
        </div>

        {/* Add Domain */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Add Domain *
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., zomato.com"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDomain())}
              />
            </div>
            <button
              type="button"
              onClick={handleAddDomain}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Domain Tags */}
        {domains.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Added Domains:</h3>
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <div
                  key={domain}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{domain}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDomain(domain)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Organizer */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Add Organizer Email
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={organizerInput}
                onChange={(e) => setOrganizerInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., organizer@zomato.com"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOrganizer())}
              />
            </div>
            <button
              type="button"
              onClick={handleAddOrganizer}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Organizer Tags */}
        {organizers.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Added Organizers:</h3>
            <div className="flex flex-wrap gap-2">
              {organizers.map((organizer) => (
                <div
                  key={organizer}
                  className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-200"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">{organizer}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOrganizer(organizer)}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {status && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-2xl p-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{status}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Organization...
            </div>
          ) : (
            'Create Organization'
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateOrganization;