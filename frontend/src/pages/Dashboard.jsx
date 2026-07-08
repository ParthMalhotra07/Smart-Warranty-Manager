import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, ShieldAlert, Wrench, FileText, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';

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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    expiringWarranty: 0,
    upcomingService: 0,
    totalDocuments: 0,
    totalValue: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/products');
        const products = data.data;
        
        const today = new Date();
        
        let expiringCount = 0;
        let upcomingServiceCount = 0;
        let docCount = 0;
        let totalValue = 0;

        products.forEach(p => {
          if (p.warrantyExpiry && differenceInDays(new Date(p.warrantyExpiry), today) <= 30 && differenceInDays(new Date(p.warrantyExpiry), today) >= 0) expiringCount++;
          if (p.nextServiceDate && differenceInDays(new Date(p.nextServiceDate), today) <= 30 && differenceInDays(new Date(p.nextServiceDate), today) >= 0) upcomingServiceCount++;
          if (p.documents?.invoice?.url) docCount++;
          if (p.documents?.manual?.url) docCount++;
          totalValue += (p.purchasePrice || 0);
        });

        setStats({
          totalProducts: products.length,
          expiringWarranty: expiringCount,
          upcomingService: upcomingServiceCount,
          totalDocuments: docCount,
          totalValue: totalValue
        });

        // Get 5 most recent
        setRecentProducts(products.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-surface animate-pulse"></div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Value" value={'$' + stats.totalValue.toLocaleString()} icon={DollarSign} color="success" delay={0.1} />
          <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="primary" delay={0.2} />
          <StatCard title="Expiring Warranty (30d)" value={stats.expiringWarranty} icon={ShieldAlert} color="danger" delay={0.3} />
          <StatCard title="Upcoming Service (30d)" value={stats.upcomingService} icon={Wrench} color="accent" delay={0.4} />
          <StatCard title="Stored Documents" value={stats.totalDocuments} icon={FileText} color="secondary" delay={0.5} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-2xl bg-surface shadow-lg border border-secondary/10 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-secondary/20">
            <h3 className="text-lg font-medium leading-6 text-white">Recently Added Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary/20">
              <thead className="bg-background/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Warranty Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20 bg-surface">
                {recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-secondary">
                      No products added yet.
                    </td>
                  </tr>
                ) : (
                  recentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-secondary">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {product.warrantyExpiry ? format(new Date(product.warrantyExpiry), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'active' ? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
