import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Package, FileText, Trash2, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="rounded-2xl bg-surface p-6 shadow-lg border border-secondary/10"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-secondary">{title}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`rounded-xl p-3 bg-background border border-${color}/20 text-${color}`}>
        <Icon className="h-6 w-6" style={{ color: `var(--color-${color})` }} />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalServices: 0,
    totalDocuments: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user and all their data?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User deleted successfully');
        fetchAdminData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Admin Panel">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-surface animate-pulse"></div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="primary" delay={0.1} />
          <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="accent" delay={0.2} />
          <StatCard title="Service Records" value={stats.totalServices} icon={Wrench} color="success" delay={0.3} />
          <StatCard title="Stored Documents" value={stats.totalDocuments} icon={FileText} color="danger" delay={0.4} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl bg-surface shadow-lg border border-secondary/10 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-secondary/20">
            <h3 className="text-lg font-medium leading-6 text-white">Registered Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary/20">
              <thead className="bg-background/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20 bg-surface">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{u.name}</div>
                          <div className="text-sm text-secondary">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="text-danger hover:text-red-400">
                          <Trash2 className="h-5 w-5 inline-block" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
