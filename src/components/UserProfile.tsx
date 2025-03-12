import { useAuth } from '../contexts/AuthContext';
import { button as buttonStyles } from "@heroui/theme";

export const UserProfile = () => {
  const { userData, loading, error, logout } = useAuth();

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userData.displayName || 'Anonymous User'}
          </h2>
          <p className="text-gray-600">{userData.email}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Created</p>
              <p className="mt-1 text-sm text-gray-900">
                {userData.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Login</p>
              <p className="mt-1 text-sm text-gray-900">
                {userData.lastLoginAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {userData.organisationsData && userData.organisationsData.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organisations</h3>
            <div className="space-y-3">
              {userData.organisationsData.map((org) => (
                <div key={org.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{org.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Joined: {org.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            onClick={logout}
            className={buttonStyles({
              color: "danger",
              radius: "md",
              variant: "shadow",
              className: "w-full"
            })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}; 