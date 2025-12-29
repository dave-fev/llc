'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Save, Plus, Trash2, Loader2, Eye } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

interface SEOSettings {
  id?: number;
  pagePath: string;
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

export default function AdminSEOPage() {
  const router = useRouter();
  const { showNotification, NotificationComponent } = useNotification();
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [formData, setFormData] = useState<SEOSettings>({
    pagePath: '',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: 'index, follow',
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.status === 401) {
        router.push('/admin-login');
        return;
      }
      fetchSEOSettings();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin-login');
    }
  };

  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo');
      if (response.ok) {
        const data = await response.json();
        setSeoSettings(data.seo || []);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seo: SEOSettings) => {
    setFormData({
      pagePath: seo.pagePath,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords || '',
      ogTitle: seo.ogTitle || '',
      ogDescription: seo.ogDescription || '',
      ogImage: seo.ogImage || '',
      twitterCard: seo.twitterCard || 'summary_large_image',
      twitterTitle: seo.twitterTitle || '',
      twitterDescription: seo.twitterDescription || '',
      twitterImage: seo.twitterImage || '',
      canonicalUrl: seo.canonicalUrl || '',
      robots: seo.robots || 'index, follow',
    });
    setEditingPath(seo.pagePath);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!formData.pagePath || !formData.title || !formData.description) {
      showNotification('error', 'Page path, title, and description are required', 'Validation Error');
      return;
    }

    setSaving(formData.pagePath);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('success', 'SEO settings saved successfully', 'Success');
        setShowAddForm(false);
        setEditingPath(null);
        setFormData({
          pagePath: '',
          title: '',
          description: '',
          keywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          twitterCard: 'summary_large_image',
          twitterTitle: '',
          twitterDescription: '',
          twitterImage: '',
          canonicalUrl: '',
          robots: 'index, follow',
        });
        fetchSEOSettings();
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to save SEO settings', 'Error');
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      showNotification('error', 'Failed to save SEO settings', 'Error');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (pagePath: string) => {
    if (!confirm(`Are you sure you want to delete SEO settings for ${pagePath}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/seo?pagePath=${encodeURIComponent(pagePath)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('success', 'SEO settings deleted successfully', 'Success');
        fetchSEOSettings();
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to delete SEO settings', 'Error');
      }
    } catch (error) {
      console.error('Error deleting SEO settings:', error);
      showNotification('error', 'Failed to delete SEO settings', 'Error');
    }
  };

  const filteredSettings = seoSettings.filter(seo =>
    seo.pagePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <>
      {NotificationComponent}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 mb-2">SEO Settings</h1>
            <p className="text-neutral-600">Manage SEO meta tags and settings for all pages</p>
          </div>
          <button
            onClick={() => {
              setFormData({
                pagePath: '',
                title: '',
                description: '',
                keywords: '',
                ogTitle: '',
                ogDescription: '',
                ogImage: '',
                twitterCard: 'summary_large_image',
                twitterTitle: '',
                twitterDescription: '',
                twitterImage: '',
                canonicalUrl: '',
                robots: 'index, follow',
              });
              setEditingPath(null);
              setShowAddForm(true);
            }}
            className="px-4 py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Page
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
          />
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-lg p-6">
            <h2 className="text-xl font-black text-neutral-900 mb-4">
              {editingPath ? 'Edit SEO Settings' : 'Add New SEO Settings'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Page Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pagePath}
                  onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                  placeholder="/about, /contact, etc."
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                  disabled={!!editingPath}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Page title (50-60 characters recommended)"
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Meta description (150-160 characters recommended)"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">OG Title</label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  placeholder="Open Graph title"
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">OG Image URL</label>
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">OG Description</label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                  placeholder="Open Graph description"
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Robots</label>
                <select
                  value={formData.robots}
                  onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, follow">Noindex, Follow</option>
                  <option value="index, nofollow">Index, Nofollow</option>
                  <option value="noindex, nofollow">Noindex, Nofollow</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/page"
                  className="w-full px-4 py-2 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none text-black"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving === formData.pagePath}
                className="px-6 py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving === formData.pagePath ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPath(null);
                  setFormData({
                    pagePath: '',
                    title: '',
                    description: '',
                    keywords: '',
                    ogTitle: '',
                    ogDescription: '',
                    ogImage: '',
                    twitterCard: 'summary_large_image',
                    twitterTitle: '',
                    twitterDescription: '',
                    twitterImage: '',
                    canonicalUrl: '',
                    robots: 'index, follow',
                  });
                }}
                className="px-6 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SEO Settings List */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-neutral-900">Page Path</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-neutral-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-neutral-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-neutral-900">Robots</th>
                  <th className="px-6 py-4 text-right text-sm font-black text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-600">
                      {searchTerm ? 'No SEO settings found matching your search' : 'No SEO settings found. Add your first page.'}
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((seo) => (
                    <tr key={seo.pagePath} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{seo.pagePath}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700 max-w-xs truncate">{seo.title}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">{seo.description}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{seo.robots || 'index, follow'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(seo)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(seo.pagePath)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}



