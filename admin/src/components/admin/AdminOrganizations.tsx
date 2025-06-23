import React from "react";
import { Building2, Globe, Mail, Loader } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";

const AdminOrganizations: React.FC<{ highlightOrgName?: string }> = ({
  highlightOrgName,
}) => {
  const { state } = useAdmin();

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Organizations</h2>
          <p className="text-sm text-gray-600">
            View and manage your organizations
          </p>
        </div>
      </div>

      {/* Organizations List */}
      {state.loading.organizations ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading organizations...</p>
        </div>
      ) : state.organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No organizations yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first organization to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {state.organizations.map((org, idx) => {
            const isHighlighted =
              highlightOrgName &&
              org.name.toLowerCase() === highlightOrgName.toLowerCase();
            return (
              <div
                key={org.id || org.name + idx}
                className={`p-4 rounded-2xl transition-colors duration-200 ${
                  isHighlighted
                    ? "bg-green-100 border-2 border-green-400 shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 truncate text-lg">
                      {org.name}
                    </span>
                  </div>
                  {org.createdAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  {org.domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {domain}
                    </span>
                  ))}
                </div>
                {org.organizers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {org.organizers.map((orgzr) => (
                      <span
                        key={orgzr}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        {orgzr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;
