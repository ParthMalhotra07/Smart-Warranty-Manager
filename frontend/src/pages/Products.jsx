import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { format } from 'date-fns';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDuplicate = async (product) => {
    try {
      const { _id, createdAt, updatedAt, ...rest } = product;
      rest.name = `${rest.name} (Copy)`;
      await api.post('/products', rest);
      toast.success('Product duplicated successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to duplicate product');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (filter === 'all') return true;
    if (filter === 'expired') return p.warrantyExpiry && new Date(p.warrantyExpiry) < today;
    if (filter === 'expiring-soon') return p.warrantyExpiry && new Date(p.warrantyExpiry) >= today && new Date(p.warrantyExpiry) <= thirtyDaysFromNow;
    if (filter === 'under-warranty') return p.warrantyExpiry && new Date(p.warrantyExpiry) >= today;
    if (filter === 'needs-service') return p.nextServiceDate && new Date(p.nextServiceDate) <= thirtyDaysFromNow;
    
    return true;
  });

  return (
    <Layout title="My Products">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-secondary/20 rounded-lg leading-5 bg-surface text-white placeholder-secondary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-secondary/20 bg-surface px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Products</option>
            <option value="expired">Expired Warranty</option>
            <option value="expiring-soon">Expiring Soon (30d)</option>
            <option value="under-warranty">Under Warranty</option>
            <option value="needs-service">Needs Service</option>
          </select>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-surface animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-secondary/10">
          <Package className="mx-auto h-12 w-12 text-secondary" />
          <h3 className="mt-2 text-sm font-medium text-white">No products</h3>
          <p className="mt-1 text-sm text-secondary">Get started by creating a new product.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/products/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-600"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Product
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="relative bg-surface border border-secondary/20 rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}/edit`)}
                >
                  <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-sm text-secondary truncate">{product.brand} • {product.category}</p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
                  <button onClick={() => navigate(`/products/${product._id}/edit`)} className="p-1 text-secondary hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDuplicate(product)} className="p-1 text-secondary hover:text-accent">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-1 text-secondary hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Purchased</span>
                  <span className="text-white">{product.purchaseDate ? format(new Date(product.purchaseDate), 'MMM dd, yyyy') : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Warranty</span>
                  <span className={product.warrantyExpiry && new Date(product.warrantyExpiry) < new Date() ? 'text-danger font-medium' : 'text-success font-medium'}>
                    {product.warrantyExpiry ? format(new Date(product.warrantyExpiry), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Next Service</span>
                  <span className="text-white">{product.nextServiceDate ? format(new Date(product.nextServiceDate), 'MMM dd, yyyy') : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Products;
