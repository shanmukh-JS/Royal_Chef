import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal configurations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Starters');
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const categories = ['Starters', 'Main Course', 'Biryani', 'Rice', 'Desserts', 'Beverages'];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get('/menu');
      if (res.data.success) {
        setMenuItems(res.data.menu);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Starters');
    setAvailable(true);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(item.price.toString());
    setCategory(item.category);
    setAvailable(item.available);
    setImageFile(null); // File upload is optional on edit
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!name.trim() || !price || !category) {
      return toast.error('Please fill in required fields');
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return toast.error('Please enter a valid positive price');
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', priceNum);
    formData.append('category', category);
    formData.append('available', available ? 1 : 0);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let response;
      if (editItem) {
        // Edit Item (PUT)
        response = await API.put(`/menu/${editItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create Item (POST)
        response = await API.post('/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        toast.success(response.data.message || 'Operation successful');
        setIsModalOpen(false);
        fetchMenu();
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Form submission failed';
      toast.error(msg);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const res = await API.delete(`/menu/${itemId}`);
      if (res.data.success) {
        toast.success('Menu item deleted');
        fetchMenu();
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Delete operation failed';
      toast.error(msg, { duration: 5000 });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Menu Items Management</h2>
          <p className="text-xs text-slate-500">Add, update, or remove dishes from the digital catalog.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-restaurant-gold hover:bg-restaurant-gold/90 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-restaurant-gold"></div>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 w-20">Image</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                    
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="h-10 w-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={
                            item.image_url 
                              ? (item.image_url.startsWith('http') ? item.image_url : `${window.location.protocol}//${window.location.hostname}:5000${item.image_url}`) 
                              : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=50'
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    
                    {/* Name & description */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 max-w-xs">{item.description}</span>
                    </td>
                    
                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-900 border border-slate-800/80 text-slate-400 font-semibold px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </td>
                    
                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-restaurant-gold">₹{item.price.toFixed(2)}</td>
                    
                    {/* Availability */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.available 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.available ? 'In Stock' : 'Sold Out'}
                      </span>
                    </td>
                    
                    {/* Actions buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <p className="text-[10px] text-slate-500">Configure catalog properties and values.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Food Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Butter Chicken"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-restaurant-gold"
                />
              </div>

              {/* Grid: Category and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-restaurant-gold"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g., 250.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-restaurant-gold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Description</label>
                <textarea
                  placeholder="Describe the dish flavors, ingredients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-restaurant-gold resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Image Attachment</label>
                <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <input
                    type="file"
                    accept="image/*"
                    id="menu-file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="menu-file"
                    className="cursor-pointer bg-slate-900 border border-slate-850 hover:bg-slate-800 px-4 py-2 rounded-lg font-bold text-[10px] uppercase text-slate-300"
                  >
                    Upload File
                  </label>
                  <span className="text-[10px] text-slate-500 truncate">
                    {imageFile ? imageFile.name : (editItem ? 'Keep current image' : 'No image chosen')}
                  </span>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="modal-available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-slate-800 text-restaurant-gold focus:ring-0 bg-slate-900 accent-restaurant-gold"
                />
                <label htmlFor="modal-available" className="font-bold text-slate-350 cursor-pointer selection:bg-transparent">
                  In Stock / Available for Customers to Order
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-800 text-slate-400 hover:text-white rounded-xl uppercase font-bold text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-restaurant-gold hover:bg-restaurant-gold/90 text-slate-950 rounded-xl uppercase font-bold text-[10px]"
                >
                  {editItem ? 'Save Updates' : 'Publish Item'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
