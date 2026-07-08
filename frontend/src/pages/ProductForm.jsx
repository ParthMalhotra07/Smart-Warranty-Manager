import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, ScanLine, Wrench, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ProductForm = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  
  const [services, setServices] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({ date: '', cost: '', description: '', workshop: '' });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  const documents = watch('documents');

  useEffect(() => {
    if (!isAddMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          const p = data.data;
          
          // Format dates for input type="date"
          const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toISOString().split('T')[0];
          };

          reset({
            ...p,
            purchaseDate: formatDate(p.purchaseDate),
            warrantyExpiry: formatDate(p.warrantyExpiry),
            insuranceExpiry: formatDate(p.insuranceExpiry),
            amcExpiry: formatDate(p.amcExpiry),
            lastServiceDate: formatDate(p.lastServiceDate),
            nextServiceDate: formatDate(p.nextServiceDate),
          });
          
          fetchServices();
        } catch (error) {
          toast.error('Failed to load product');
          navigate('/products');
        }
      };
      
      const fetchServices = async () => {
        try {
          const { data } = await api.get(`/products/${id}/services`);
          setServices(data.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchProduct();
    }
  }, [id, isAddMode, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isAddMode) {
        await api.post('/products', data);
        toast.success('Product added successfully');
      } else {
        await api.put(`/products/${id}`, data);
        toast.success('Product updated successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingDoc(true);
    try {
      const { data } = await api.post('/uploads/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = data.data.url;
      // Depending on structure, set value
      // Assuming flat structure in form for now or nested
      setValue(`documents.${type}.url`, fileUrl);
      toast.success(`${type} uploaded successfully!`);

      // If it's an invoice, optionally trigger OCR
      if (type === 'invoice') {
        runOCR(fileUrl);
      }
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploadingDoc(false);
    }
  };

  const runOCR = async (imageUrl) => {
    setOcrLoading(true);
    const toastId = toast.loading('Running OCR to extract data...');
    try {
      const { data } = await api.post('/ocr/extract', { imageUrl });
      const { extractedData } = data;
      
      if (extractedData.productName) setValue('name', extractedData.productName);
      if (extractedData.brand) setValue('brand', extractedData.brand);
      if (extractedData.purchaseAmount) setValue('purchasePrice', extractedData.purchaseAmount);
      if (extractedData.modelNumber) setValue('modelNumber', extractedData.modelNumber);
      if (extractedData.purchaseDate) setValue('purchaseDate', extractedData.purchaseDate);
      
      toast.success('OCR completed! Please verify the extracted data.', { id: toastId });
    } catch (error) {
      toast.error('OCR failed or no data extracted.', { id: toastId });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/services`, newService);
      toast.success('Service record added!');
      setShowServiceForm(false);
      setNewService({ date: '', cost: '', description: '', workshop: '' });
      
      // Refresh services
      const { data } = await api.get(`/products/${id}/services`);
      setServices(data.data);
    } catch (error) {
      toast.error('Failed to add service record');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if(window.confirm('Delete this service record?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        toast.success('Deleted successfully');
        setServices(services.filter(s => s._id !== serviceId));
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <Layout title={isAddMode ? 'Add New Product' : 'Edit Product'}>
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg space-y-6">
          <h3 className="text-xl font-medium text-white border-b border-secondary/20 pb-4">Basic Details</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Product Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
              {errors.name && <p className="text-danger text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Brand *</label>
              <input {...register('brand', { required: 'Brand is required' })} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
              {errors.brand && <p className="text-danger text-sm mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Category *</label>
              <select {...register('category', { required: 'Category is required' })} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Gadgets">Gadgets</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-danger text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Model Number</label>
              <input {...register('modelNumber')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Serial Number</label>
              <input {...register('serialNumber')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Purchase Price</label>
              <input type="number" {...register('purchasePrice')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg space-y-6">
          <h3 className="text-xl font-medium text-white border-b border-secondary/20 pb-4">Dates & Expiries</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Purchase Date</label>
              <input type="date" {...register('purchaseDate')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Warranty Expiry</label>
              <input type="date" {...register('warrantyExpiry')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Insurance Expiry</label>
              <input type="date" {...register('insuranceExpiry')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">AMC Expiry</label>
              <input type="date" {...register('amcExpiry')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Next Service Date</label>
              <input type="date" {...register('nextServiceDate')} className="w-full rounded-lg border border-secondary/30 bg-background px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-secondary/20 shadow-lg space-y-6">
          <h3 className="text-xl font-medium text-white border-b border-secondary/20 pb-4">Documents (OCR Auto-fill)</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="border-2 border-dashed border-secondary/30 rounded-xl p-6 text-center hover:bg-background/50 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-secondary mb-4" />
              <div className="text-sm text-secondary">
                <label htmlFor="invoice-upload" className="relative cursor-pointer bg-primary/10 rounded-md font-medium text-primary hover:text-blue-500 px-2 py-1">
                  <span>Upload Invoice</span>
                  <input id="invoice-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'invoice')} accept="image/*,.pdf" />
                </label>
                <p className="pl-1 mt-2">Uploading will auto-extract details</p>
                {documents?.invoice?.url && (
                  <a href={documents.invoice.url} target="_blank" rel="noreferrer" className="block mt-3 text-accent hover:underline font-medium">
                    View Uploaded Invoice
                  </a>
                )}
              </div>
              {uploadingDoc && <p className="text-xs text-accent mt-2 flex items-center justify-center"><Loader2 className="animate-spin h-3 w-3 mr-1"/> Uploading...</p>}
              {ocrLoading && <p className="text-xs text-accent mt-2 flex items-center justify-center"><ScanLine className="animate-pulse h-3 w-3 mr-1"/> Analyzing Invoice...</p>}
            </div>

            <div className="border-2 border-dashed border-secondary/30 rounded-xl p-6 text-center hover:bg-background/50 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-secondary mb-4" />
              <div className="text-sm text-secondary">
                <label htmlFor="manual-upload" className="relative cursor-pointer bg-primary/10 rounded-md font-medium text-primary hover:text-blue-500 px-2 py-1">
                  <span>Upload Manual</span>
                  <input id="manual-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'manual')} accept=".pdf" />
                </label>
                <p className="pl-1 mt-2">PDF files up to 10MB</p>
                {documents?.manual?.url && (
                  <a href={documents.manual.url} target="_blank" rel="noreferrer" className="block mt-3 text-accent hover:underline font-medium">
                    View Uploaded Manual
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/products')} className="px-6 py-2.5 border border-secondary/30 rounded-lg text-secondary hover:bg-secondary/10 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex items-center px-6 py-2.5 bg-primary rounded-lg text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {isAddMode ? 'Save Product' : 'Update Product'}
          </button>
        </div>
      </form>

      {!isAddMode && (
        <div className="lg:w-96 space-y-8">
          <div className="bg-surface rounded-2xl p-6 border border-secondary/20 shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b border-secondary/20 pb-4">
              <h3 className="text-xl font-medium text-white flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-accent" />
                Service History
              </h3>
              <button 
                onClick={() => setShowServiceForm(!showServiceForm)}
                className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {showServiceForm && (
              <form onSubmit={handleAddService} className="mb-6 p-4 bg-background/50 border border-secondary/20 rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Date *</label>
                  <input type="date" required value={newService.date} onChange={e => setNewService({...newService, date: e.target.value})} className="w-full rounded-md border border-secondary/30 bg-background px-3 py-1.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Cost</label>
                  <input type="number" value={newService.cost} onChange={e => setNewService({...newService, cost: e.target.value})} className="w-full rounded-md border border-secondary/30 bg-background px-3 py-1.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Workshop</label>
                  <input type="text" value={newService.workshop} onChange={e => setNewService({...newService, workshop: e.target.value})} className="w-full rounded-md border border-secondary/30 bg-background px-3 py-1.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary mb-1">Description *</label>
                  <textarea required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="w-full rounded-md border border-secondary/30 bg-background px-3 py-1.5 text-white text-sm" rows="2"></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowServiceForm(false)} className="px-3 py-1 text-xs border border-secondary/30 rounded text-secondary hover:bg-secondary/10">Cancel</button>
                  <button type="submit" className="px-3 py-1 text-xs bg-primary rounded text-white hover:bg-blue-600">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {services.length === 0 ? (
                <p className="text-sm text-secondary text-center py-4">No service records found.</p>
              ) : (
                services.map(s => (
                  <div key={s._id} className="p-4 bg-background rounded-xl border border-secondary/10 group">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {format(new Date(s.date), 'MMM dd, yyyy')}
                      </span>
                      <button onClick={() => handleDeleteService(s._id)} className="opacity-0 group-hover:opacity-100 p-1 text-secondary hover:text-danger transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-white mt-2 font-medium">{s.description}</p>
                    <div className="mt-2 text-xs text-secondary flex justify-between">
                      <span>{s.workshop || 'Unknown Workshop'}</span>
                      <span className="text-accent font-medium">${s.cost}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default ProductForm;
