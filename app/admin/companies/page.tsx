'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, Loader2, Eye, X } from 'lucide-react';

interface Company {
  id: number;
  company_name: string;
  state: string;
  state_fee: number;
  purpose?: string;
  physical_address?: string;
  mailing_address?: string;
  same_as_physical: boolean;
  management_type: string;
  owners?: any[];
  managers?: any[];
  contact_email: string;
  contact_phone: string;
  account_email: string;
  additional_services?: any;
  created_at: string;
  updated_at: string;
  order_number: string;
  tx_ref?: string;
  order_status: string;
  amount: number;
  payment_method: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSendDocModalOpen, setIsSendDocModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', url: '', subject: '', message: '' });
  const [sendingDoc, setSendingDoc] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/api/admin/companies?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/companies';

      const response = await fetch(url);

      if (response.status === 401) {
        router.push('/admin-login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (company: Company) => {
    setSelectedCompany(company);
    setIsViewModalOpen(true);
  };

  const openSendDocModal = (company: Company) => {
    setSelectedCompany(company);
    setDocForm({ name: '', url: '', subject: 'New Document/File', message: 'Hello, we have uploaded a new document for your LLC.' });
    setIsSendDocModalOpen(true);
  };

  const handleSendDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    setSendingDoc(true);
    try {
      const response = await fetch('/api/admin/companies/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany.id,
          documentName: docForm.name,
          documentUrl: docForm.url,
          subject: docForm.subject,
          message: docForm.message
        })
      });
      if (response.ok) {
        alert('Document sent successfully!');
        setIsSendDocModalOpen(false);
      } else {
        alert('Failed to send document.');
      }
    } catch (error) {
      console.error(error);
      alert('Error sending document');
    } finally {
      setSendingDoc(false);
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Companies</h1>
          <p className="text-neutral-600">Manage all registered companies and LLCs</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium">Total Companies</p>
            <p className="text-3xl font-black text-neutral-900">{companies.length}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search companies by name, state, order number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Management Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-600">
                    {searchQuery ? 'No companies found matching your search' : 'No companies found'}
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-neutral-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-neutral-900">{company.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-700">{company.state}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-neutral-600">{company.order_number || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        {company.management_type === 'member-managed' ? 'Member' : 'Manager'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${company.order_status === 'completed'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : company.order_status === 'processing'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {company.order_status ? company.order_status.charAt(0).toUpperCase() + company.order_status.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600">
                        {new Date(company.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openViewModal(company)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => openSendDocModal(company)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ml-2"
                      >
                        Send Doc
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Details Modal */}
      {isViewModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">Company Details</h2>
                  <p className="text-sm text-neutral-600 mt-1">{selectedCompany.company_name}</p>
                </div>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedCompany(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Company Name</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.state}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State Fee</p>
                    <p className="text-sm font-bold text-neutral-900">${parseFloat(selectedCompany.state_fee.toString()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Management Type</p>
                    <p className="text-sm font-bold text-neutral-900 capitalize">{selectedCompany.management_type?.replace('-', ' ') || 'N/A'}</p>
                  </div>
                  {selectedCompany.purpose && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Business Purpose</p>
                      <p className="text-sm text-neutral-900">{selectedCompany.purpose}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Order Number</p>
                    <p className="text-sm font-mono font-bold text-neutral-900">{selectedCompany.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Transaction Reference</p>
                    <p className="text-sm font-mono text-neutral-900">{selectedCompany.tx_ref || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Amount</p>
                    <p className="text-sm font-bold text-neutral-900">${parseFloat(selectedCompany.amount.toString()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Payment Method</p>
                    <p className="text-sm font-bold text-neutral-900 capitalize">{selectedCompany.payment_method || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Status</p>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${selectedCompany.order_status === 'completed'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : selectedCompany.order_status === 'processing'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                      {selectedCompany.order_status ? selectedCompany.order_status.charAt(0).toUpperCase() + selectedCompany.order_status.slice(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-2">Physical Address</p>
                    <p className="text-sm text-neutral-900 whitespace-pre-line">
                      {(() => {
                        try {
                          const parsed = typeof selectedCompany.physical_address === 'string'
                            ? JSON.parse(selectedCompany.physical_address)
                            : selectedCompany.physical_address;
                          if (typeof parsed === 'object' && parsed.street) {
                            return `${parsed.street}\n${parsed.city}, ${parsed.state} ${parsed.zip}`;
                          }
                          return selectedCompany.physical_address || 'N/A';
                        } catch {
                          return selectedCompany.physical_address || 'N/A';
                        }
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-2">Mailing Address</p>
                    <p className="text-sm text-neutral-900 whitespace-pre-line">
                      {selectedCompany.same_as_physical
                        ? 'Same as Physical Address'
                        : (() => {
                          try {
                            const parsed = typeof selectedCompany.mailing_address === 'string'
                              ? JSON.parse(selectedCompany.mailing_address)
                              : selectedCompany.mailing_address;
                            if (typeof parsed === 'object' && parsed.street) {
                              return `${parsed.street}\n${parsed.city}, ${parsed.state} ${parsed.zip}`;
                            }
                            return selectedCompany.mailing_address || 'N/A';
                          } catch {
                            return selectedCompany.mailing_address || 'N/A';
                          }
                        })()
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Owners */}
              {(() => {
                let ownersList: any[] = [];
                if (selectedCompany.owners) {
                  try {
                    ownersList = typeof selectedCompany.owners === 'string'
                      ? JSON.parse(selectedCompany.owners)
                      : selectedCompany.owners;
                  } catch {
                    ownersList = Array.isArray(selectedCompany.owners) ? selectedCompany.owners : [];
                  }
                }
                return ownersList.length > 0 ? (
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4">Owners / Members</h3>
                    <div className="space-y-3">
                      {ownersList.map((owner: any, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-xl p-4">
                          <p className="text-sm font-bold text-neutral-900">
                            {owner.firstName} {owner.lastName}
                          </p>
                          <p className="text-xs text-neutral-600">{owner.email}</p>
                          <p className="text-xs text-neutral-600">{owner.phone}</p>
                          {owner.address && (
                            <p className="text-xs text-neutral-500 mt-1">{owner.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Managers */}
              {(() => {
                let managersList: any[] = [];
                if (selectedCompany.managers) {
                  try {
                    managersList = typeof selectedCompany.managers === 'string'
                      ? JSON.parse(selectedCompany.managers)
                      : selectedCompany.managers;
                  } catch {
                    managersList = Array.isArray(selectedCompany.managers) ? selectedCompany.managers : [];
                  }
                }
                return managersList.length > 0 ? (
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4">Managers</h3>
                    <div className="space-y-3">
                      {managersList.map((manager: any, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-xl p-4">
                          <p className="text-sm font-bold text-neutral-900">
                            {manager.firstName} {manager.lastName}
                          </p>
                          <p className="text-xs text-neutral-600">{manager.email}</p>
                          <p className="text-xs text-neutral-600">{manager.phone}</p>
                          {manager.address && (
                            <p className="text-xs text-neutral-500 mt-1">{manager.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Contact Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Email</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Phone</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Account Email</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.account_email}</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              {selectedCompany.additional_services && Object.keys(selectedCompany.additional_services).some(key => selectedCompany.additional_services[key]) && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">Additional Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.additional_services.ein && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">EIN</span>
                    )}
                    {selectedCompany.additional_services.website && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Website</span>
                    )}
                    {selectedCompany.additional_services.itin && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ITIN</span>
                    )}
                    {selectedCompany.additional_services.branding && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Branding</span>
                    )}
                  </div>
                </div>
              )}

              {/* User Account */}
              {selectedCompany.user && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">User Account</h3>
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-neutral-900">
                      {selectedCompany.user.firstName} {selectedCompany.user.lastName}
                    </p>
                    <p className="text-xs text-neutral-600">{selectedCompany.user.email}</p>
                    {selectedCompany.user.phone && (
                      <p className="text-xs text-neutral-600">{selectedCompany.user.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Created At</p>
                    <p className="text-sm text-neutral-900">
                      {new Date(selectedCompany.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Last Updated</p>
                    <p className="text-sm text-neutral-900">
                      {new Date(selectedCompany.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Document Modal */}
      {isSendDocModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Send Entity Document</h3>
              <button onClick={() => setIsSendDocModalOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSendDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Document Name</label>
                <input required type="text" className="w-full border p-2 rounded" placeholder="e.g. Filed Articles of Organization"
                  value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Document URL</label>
                <input required type="url" className="w-full border p-2 rounded" placeholder="https://..."
                  value={docForm.url} onChange={e => setDocForm({ ...docForm, url: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Subject</label>
                <input required type="text" className="w-full border p-2 rounded"
                  value={docForm.subject} onChange={e => setDocForm({ ...docForm, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Message</label>
                <textarea required className="w-full border p-2 rounded h-24"
                  value={docForm.message} onChange={e => setDocForm({ ...docForm, message: e.target.value })} />
              </div>
              <button disabled={sendingDoc} type="submit" className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-neutral-800 disabled:opacity-50">
                {sendingDoc ? 'Sending...' : 'Send Document & Email'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
