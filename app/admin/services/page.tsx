'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Package } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

interface Service {
  id: number;
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  displayOrder: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    serviceId: '',
    name: '',
    description: '',
    price: 0,
    isActive: true,
    displayOrder: 0,
  });
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        showNotification('error', 'Failed to load services', 'Error');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      showNotification('error', 'Failed to load services', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      serviceId: '',
      name: '',
      description: '',
      price: 0,
      isActive: true,
      displayOrder: services.length,
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setIsAdding(false);
    setFormData({
      serviceId: service.serviceId,
      name: service.name,
      description: service.description || '',
      price: service.price,
      isActive: service.isActive,
      displayOrder: service.displayOrder,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      serviceId: '',
      name: '',
      description: '',
      price: 0,
      isActive: true,
      displayOrder: 0,
    });
  };

  const handleSave = async () => {
    if (!formData.serviceId || !formData.name || formData.price === undefined) {
      showNotification('error', 'Please fill in all required fields', 'Validation Error');
      return;
    }

    setIsSaving(true);
    try {
      let response;
      if (isAdding) {
        // Create new service
        response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else if (editingId) {
        // Update existing service
        response = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            ...formData,
          }),
        });
      }

      if (response?.ok) {
        showNotification('success', `Service ${isAdding ? 'created' : 'updated'} successfully!`, 'Success');
        handleCancel();
        fetchServices();
      } else {
        const data = await response?.json();
        showNotification('error', data.error || 'Failed to save service', 'Error');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showNotification('error', 'Failed to save service', 'Error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('success', 'Service deleted successfully!', 'Success');
        fetchServices();
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to delete service', 'Error');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showNotification('error', 'Failed to delete service', 'Error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <>
      {NotificationComponent}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-neutral-900 mb-2">Services Management</h1>
            <p className="text-neutral-600">Manage additional services and their pricing</p>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || editingId !== null}
            className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId !== null) && (
          <div className="bg-white rounded-2xl border-2 border-neutral-900 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-neutral-900">
                {isAdding ? 'Add New Service' : 'Edit Service'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  Service ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  placeholder="ein, website, itin, etc."
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                  disabled={!isAdding}
                />
                <p className="text-xs text-neutral-500 mt-1">Unique identifier (lowercase, no spaces)</p>
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="EIN Application"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-900 block mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Get your federal tax ID number for business operations"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-neutral-900 block mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="79"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-neutral-900 block mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-neutral-900 border-2 border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-neutral-900 cursor-pointer">
                  Active (visible to customers)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 font-bold rounded-xl hover:bg-neutral-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 bg-neutral-50">
            <h2 className="text-xl font-black text-neutral-900">All Services</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {services.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 font-medium">No services found. Add your first service to get started.</p>
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className={`p-6 hover:bg-neutral-50 transition-colors ${!service.isActive ? 'opacity-60' : ''}`}
                >
                  {editingId === service.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-neutral-900 block mb-2">Service ID</label>
                        <input
                          type="text"
                          value={formData.serviceId}
                          onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-neutral-900 block mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-neutral-900 block mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-bold text-neutral-900 block mb-2">Price ($)</label>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-neutral-900 block mb-2">Display Order</label>
                          <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            min="0"
                            className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-5 h-5 text-neutral-900 border-2 border-neutral-300 rounded"
                        />
                        <label className="text-sm font-bold text-neutral-900">Active</label>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-neutral-100 text-neutral-900 font-bold rounded-lg hover:bg-neutral-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-neutral-900">{service.name}</h3>
                          {!service.isActive && (
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-bold rounded">Inactive</span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-neutral-600 mb-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-neutral-500">ID: <span className="font-bold text-neutral-700">{service.serviceId}</span></span>
                          <span className="text-neutral-500">Order: <span className="font-bold text-neutral-700">{service.displayOrder}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-black text-neutral-900">${service.price}</div>
                          <div className="text-xs text-neutral-500">Price</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}



