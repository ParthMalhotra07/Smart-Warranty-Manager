import Sidebar from './Sidebar';

const Layout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center px-8 border-b border-secondary/20 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
