const Profile = () => {
    const { user } = useStore();
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };