import { useContext, useState } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Bell, Shield, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/auth/updatepassword', passwords);
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl space-y-8">
        
        {/* Profile Card */}
        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-secondary">{user?.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
              {user?.role}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg space-y-6">
          <div className="flex items-center space-x-3 border-b border-secondary/20 pb-4">
            <Bell className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-medium text-white">Notifications & Preferences</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email Reminders</h4>
              <p className="text-sm text-secondary">Receive emails before your product warranties or insurances expire.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={true} />
              <div className="w-11 h-6 bg-secondary/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg space-y-6">
          <div className="flex items-center space-x-3 border-b border-secondary/20 pb-4">
            <Shield className="h-6 w-6 text-danger" />
            <h3 className="text-xl font-medium text-white">Security</h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-primary rounded-lg text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Update Password
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
};

export default Profile;
