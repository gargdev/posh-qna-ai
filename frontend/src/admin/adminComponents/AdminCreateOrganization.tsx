// import { useState } from 'react';
// import type { FormEvent } from 'react';
// import axios from 'axios';

// const AdminCreateOrganization = () => {
//   const [name, setName] = useState('');
//   const [domainInput, setDomainInput] = useState('');
//   const [domains, setDomains] = useState<string[]>([]);
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
//         { name, domains },
//         { withCredentials: true },
//       );
//       setStatus('Organization created successfully!');
//       setName('');
//       setDomains([]);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.error || 'Failed to create organization');
//       } else {
//         setError('Failed to create organization');
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-6">
//       <h2 className="text-xl font-bold mb-4">Create Organization</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Organization Name
//           </label>
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
//           <label className="block text-sm font-medium text-gray-700">
//             Add Domain
//           </label>
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
//                 <li
//                   key={domain}
//                   className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
//                 >
//                   {domain}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveDomain(domain)}
//                     className="ml-2 text-red-600 hover:text-red-800"
//                   >
//                     &times;
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

import { useState, type FormEvent } from 'react';
import axios from 'axios';

const AdminCreateOrganization = () => {
  const [name, setName] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [organizerInput, setOrganizerInput] = useState('');
  const [organizers, setOrganizers] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddDomain = () => {
    if (domainInput.trim()) {
      const domain = domainInput.trim().toLowerCase();
      if (!domains.includes(domain)) {
        setDomains([...domains, domain]);
        setDomainInput('');
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

    if (!name.trim() || domains.length === 0) {
      setError('Organization name and at least one domain are required');
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
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Create Organization</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-xl border border-gray-300 p-2 w-full"
            placeholder="e.g., Zomato"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Domain</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
              placeholder="e.g., zomato.com"
            />
            <button
              type="button"
              onClick={handleAddDomain}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
        {domains.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Added Domains:</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {domains.map((domain) => (
                <li key={domain} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  {domain}
                  <button
                    type="button"
                    onClick={() => handleRemoveDomain(domain)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Organizer Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={organizerInput}
              onChange={(e) => setOrganizerInput(e.target.value)}
              className="mt-1 rounded-xl border border-gray-300 p-2 flex-1"
              placeholder="e.g., organizer@zomato.com"
            />
            <button
              type="button"
              onClick={handleAddOrganizer}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
        {organizers.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Added Organizers:</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {organizers.map((organizer) => (
                <li key={organizer} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  {organizer}
                  <button
                    type="button"
                    onClick={() => handleRemoveOrganizer(organizer)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
        >
          Create Organization
        </button>
        {status && <p className="text-green-600 mt-2">{status}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AdminCreateOrganization;