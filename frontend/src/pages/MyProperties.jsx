import { useState, useEffect } from 'react';
import { getMyProperties, createProperty, deleteProperty } from '../api/propertyApi';
import { uploadMedia } from '../api/mediaApi';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // New property form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    listing_type: 'sale',
    price: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    has_virtual_tour: false
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchProps = async () => {
    try {
      const res = await getMyProperties();
      setProperties(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch your properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProps(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this property listing?')) {
      try {
        await deleteProperty(id);
        toast.success('Property listing removed');
        fetchProps();
      } catch (e) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        area_sqft: form.area_sqft ? parseFloat(form.area_sqft) : null,
        has_virtual_tour: form.has_virtual_tour ? 1 : 0
      };

      const res = await createProperty(payload);
      const newPropertyId = res.data.data.property_id;

      // Upload image if selected
      if (selectedFile && newPropertyId) {
        const formData = new FormData();
        formData.append('media', selectedFile);
        formData.append('property_id', newPropertyId);
        formData.append('media_type', 'photo');
        formData.append('is_primary', 'true');
        await uploadMedia(formData);
      }

      toast.success('Property created successfully!');
      setShowAddModal(false);
      setForm({
        title: '',
        description: '',
        property_type: 'apartment',
        listing_type: 'sale',
        price: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        bedrooms: '',
        bathrooms: '',
        area_sqft: '',
        has_virtual_tour: false
      });
      setSelectedFile(null);
      fetchProps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your properties...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-sm text-gray-500">Manage your active and pending real estate listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg flex items-center shadow font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Property
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map(p => (
                <tr key={p.property_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 mr-3">
                        <img
                          src={p.primary_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{p.title}</div>
                        <div className="text-xs text-gray-500">{p.city}{p.state ? `, ${p.state}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {p.property_type} ({p.listing_type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full capitalize ${p.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/properties/${p.property_id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                      title="View Listing"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(p.property_id)}
                      className="text-red-500 hover:text-red-700 inline-flex items-center"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {properties.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-semibold mb-1">No properties listed yet.</p>
            <p className="text-sm mb-4">Click "Add New Property" to create your first verified real estate listing!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Add Property
            </button>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">Add New Property Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateProperty} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Modern 3BHK Luxury Apartment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                  <select
                    value={form.property_type}
                    onChange={e => setForm({ ...form, property_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">Independent House</option>
                    <option value="condo">Condo</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
                  <select
                    value={form.listing_type}
                    onChange={e => setForm({ ...form, listing_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 7500000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    value={form.area_sqft}
                    onChange={e => setForm({ ...form, area_sqft: e.target.value })}
                    placeholder="e.g. 1450"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={e => setForm({ ...form, bedrooms: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={e => setForm({ ...form, bathrooms: e.target.value })}
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Street address / Landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                    placeholder="e.g. 400050"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your property, highlights, locality..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Photo</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer border border-dashed border-gray-300 hover:border-blue-600 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-gray-600 transition-colors">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>{selectedFile ? selectedFile.name : 'Choose image file'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => setSelectedFile(e.target.files[0] || null)}
                    />
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vtour"
                  checked={form.has_virtual_tour}
                  onChange={e => setForm({ ...form, has_virtual_tour: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="vtour" className="text-sm text-gray-700">
                  Has 360° Virtual Tour
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
