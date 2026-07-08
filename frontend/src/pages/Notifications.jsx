import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Bell, ShieldAlert, Wrench, FileText } from 'lucide-react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'warranty': return <ShieldAlert className="h-6 w-6 text-danger" />;
      case 'service': return <Wrench className="h-6 w-6 text-accent" />;
      case 'insurance': return <FileText className="h-6 w-6 text-primary" />;
      default: return <Bell className="h-6 w-6 text-secondary" />;
    }
  };

  return (
    <Layout title="Notifications">
      <div className="max-w-4xl space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-surface animate-pulse"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface border border-secondary/20 rounded-xl p-8 text-center text-secondary">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-1">You're all caught up!</h3>
            <p>You have no pending warranties or upcoming services.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`bg-surface border ${notif.isRead ? 'border-secondary/20' : 'border-primary/50'} rounded-xl p-5 flex items-start space-x-4 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`p-3 rounded-full ${notif.isRead ? 'bg-background' : 'bg-primary/10'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-lg ${notif.isRead ? 'text-secondary font-medium' : 'text-white font-semibold'}`}>{notif.title}</h4>
                  <span className="text-xs text-secondary">{notif.date}</span>
                </div>
                <p className={`mt-1 ${notif.isRead ? 'text-secondary/70' : 'text-secondary'}`}>{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div className="h-3 w-3 bg-primary rounded-full mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
