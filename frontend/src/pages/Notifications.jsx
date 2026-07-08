import Layout from '../components/Layout';
import { Bell, ShieldAlert, Wrench, FileText } from 'lucide-react';

const Notifications = () => {
  // In a real app, this would be fetched from the backend Notification model
  const notifications = [
    { id: 1, title: 'Warranty Expiring Soon', message: 'Samsung Fridge warranty expires in 15 days.', type: 'warranty', date: '2 hours ago', isRead: false },
    { id: 2, title: 'Upcoming Service', message: 'Toyota Car is due for service next week.', type: 'service', date: '1 day ago', isRead: true },
    { id: 3, title: 'Insurance Renewal', message: 'Health Insurance expires in 30 days.', type: 'insurance', date: '2 days ago', isRead: true }
  ];

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
        {notifications.map((notif) => (
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
        ))}
      </div>
    </Layout>
  );
};

export default Notifications;
