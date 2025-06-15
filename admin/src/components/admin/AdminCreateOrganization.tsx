import React, { useState, type FormEvent } from 'react';
import { Building2, Globe, Mail, Plus, X } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminCreateOrganization: React.FC = () => {
  const [name, setName] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [organizerInput, setOrganizerInput] = useState('');
  const [organizers, setOrganizers] = useState<string[]>([]);

  const { state, actions } = useAdmin();
  const { showSuccess, showError } = useNotification();

  const handleAddDomain = () => {
    if (domainInput.trim()) {
      const domain = domainInput.trim().toLowerCase();
      if (!domains.includes(domain)) {
        setDomains([...domains, domain]);
        setDomainInput('');
      } else {
        showError('Duplicate Domain', 'This domain has already been added');
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
        showError('Duplicate Organizer', 'This organizer has already been added');
      }
    }
  };

  const handleRemoveOrganizer = (organizer: string) => {
    setOrganizers(organizers.filter((o) => o !== organizer));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showError('Validation Error', 'Organization name is required');
      return;
    }

    if (domains.length === 0) {
      showError('Validation Error', 'At least one domain is required');
      return;
    }

    try {
      await actions.createOrganization({ name: name.trim(), domains, organizers });
      showSuccess('Success', 'Organization created successfully!');
      
      // Reset form
      setName('');
      setDomains([]);
      setOrganizers([]);
      setDomainInput('');
      setOrganizerInput('');
    } catch (error) {
      // Error is already handled in context
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
            disabled={state.loading.organizations}
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
                disabled={state.loading.organizations}
              />
            </div>
            <button
              type="button"
              onClick={handleAddDomain}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={state.loading.organizations}
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
                    disabled={state.loading.organizations}
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
                disabled={state.loading.organizations}
              />
            </div>
            <button
              type="button"
              onClick={handleAddOrganizer}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={state.loading.organizations}
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
                    disabled={state.loading.organizations}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state.loading.organizations}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {state.loading.organizations ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2 text-white" />
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