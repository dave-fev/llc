'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, Eye, X, Download, FileText, MapPin, User, Calendar, ShieldCheck } from 'lucide-react';
import { generateOrderPDF } from '../../utils/pdfGenerator';

interface Company {
  id: number;
  company_name: string;
  state: string;
  order_number: string;
  created_at: string;
  expiry_date?: string;
}

export default function UserCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/companies');

      if (response.status === 401) {
        router.push('/');
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

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: 'Expired', color: 'bg-red-500', isCritical: true };
    if (diffDays <= 30) return { label: `Expires in ${diffDays} days`, color: 'bg-orange-500', isCritical: true };
    return { label: `Active until ${expiry.toLocaleDateString()}`, color: 'bg-green-500', isCritical: false };
  };

  const handleDownloadPDF = async (company: any) => {
    try {
      setIsDownloading(true);
      // Ensure we have full details
      const response = await fetch(`/api/orders/get?orderId=${company.id}`);
      if (response.ok) {
        const data = await response.json();
        const fullData = { ...data.order, ...company };
        generateOrderPDF(fullData);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const openViewModal = async (company: Company) => {
    try {
      const response = await fetch(`/api/orders/get?orderId=${company.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedCompany({ ...data.order, ...company });
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">My Companies</h1>
          <p className="text-neutral-600">View all your successfully formed companies and track renewals</p>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">No companies found</p>
          <p className="text-sm text-neutral-500 mt-2">Your completed orders will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const expiryStatus = getExpiryStatus(company.expiry_date);
            return (
              <div
                key={company.id}
                className={`bg-white rounded-2xl border ${expiryStatus?.isCritical ? 'border-red-200 bg-red-50/10' : 'border-neutral-200'} shadow-sm p-6 hover:shadow-xl transition-all flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => openViewModal(company)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-neutral-900 mb-1">{company.company_name}</h3>
                <p className="text-sm text-neutral-600 mb-4">{company.state}</p>

                {expiryStatus && (
                  <div className="mb-4">
                    <span className={`${expiryStatus.color} text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                      {expiryStatus.label}
                    </span>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
                    Order #{company.order_number}
                  </div>
                  {expiryStatus?.isCritical && (
                    <button
                      onClick={() => router.push('/form')} // For now redirect to form or to a payment page
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
                    >
                      Renew Now ($200)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Company Details Modal */}
      {isViewModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white z-10 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 leading-tight">Entity Details</h2>
                    <p className="text-sm text-neutral-500 font-medium">{selectedCompany.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(selectedCompany)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedCompany(null);
                    }}
                    className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Entity Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-black text-neutral-900 uppercase">Active Entity</span>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">State</p>
                  <p className="text-sm font-black text-neutral-900">{selectedCompany.state}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Formed On</p>
                  <p className="text-sm font-black text-neutral-900">{new Date(selectedCompany.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-t border-neutral-100 pt-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-neutral-900" />
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight uppercase text-xs tracking-widest">Formation Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Company Name</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCompany.company_name}</p>
                  </div>
                  <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Order Number</p>
                    <p className="text-sm font-mono font-bold text-neutral-900">#{selectedCompany.order_number}</p>
                  </div>
                  <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">State Fee Paid</p>
                    <p className="text-sm font-bold text-neutral-900">${parseFloat(String(selectedCompany.state_fee || 0)).toFixed(2)}</p>
                  </div>
                  <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Management Type</p>
                    <p className="text-sm font-bold text-neutral-900 capitalize">{selectedCompany.management_type?.replace('-', ' ') || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Expiry Date</p>
                    <p className="text-sm font-bold text-neutral-900">
                      {selectedCompany.expiry_date ? new Date(selectedCompany.expiry_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-100 pt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">Physical Address</h3>
                  </div>
                  <p className="text-sm text-neutral-600 bg-neutral-50 p-5 rounded-2xl border border-neutral-100 leading-relaxed font-medium min-h-[100px] whitespace-pre-line">
                    {(() => {
                      const addr = selectedCompany.physical_address;
                      if (!addr) return 'N/A';
                      if (typeof addr === 'object') {
                        return `${addr.street || ''}\n${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim() || 'N/A';
                      }
                      try {
                        const parsed = JSON.parse(addr);
                        if (typeof parsed === 'object' && parsed !== null) {
                          return `${parsed.street || ''}\n${parsed.city || ''}, ${parsed.state || ''} ${parsed.zip || ''}`.trim() || 'N/A';
                        }
                      } catch (e) { }
                      return String(addr);
                    })()}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">Mailing Address</h3>
                  </div>
                  <p className="text-sm text-neutral-600 bg-neutral-50 p-5 rounded-2xl border border-neutral-100 leading-relaxed font-medium min-h-[100px] whitespace-pre-line">
                    {selectedCompany.same_as_physical
                      ? 'Same as Physical Address'
                      : (() => {
                        const addr = selectedCompany.mailing_address;
                        if (!addr) return 'N/A';
                        if (typeof addr === 'object') {
                          return `${addr.street || ''}\n${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim() || 'N/A';
                        }
                        try {
                          const parsed = JSON.parse(addr);
                          if (typeof parsed === 'object' && parsed !== null) {
                            return `${parsed.street || ''}\n${parsed.city || ''}, ${parsed.state || ''} ${parsed.zip || ''}`.trim() || 'N/A';
                          }
                        } catch (e) { }
                        return String(addr);
                      })()
                    }
                  </p>
                </div>
              </div>

              {/* Management & Owners */}
              {(() => {
                let ownersList: any[] = [];
                try {
                  ownersList = typeof selectedCompany.owners === 'string'
                    ? JSON.parse(selectedCompany.owners)
                    : selectedCompany.owners;
                } catch {
                  ownersList = Array.isArray(selectedCompany.owners) ? selectedCompany.owners : [];
                }
                return ownersList.length > 0 ? (
                  <div className="border-t border-neutral-100 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-amber-600" />
                      <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Owners / Members</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ownersList.map((owner: any, index: number) => (
                        <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-5 group hover:border-neutral-900 transition-all shadow-sm">
                          <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md group-hover:scale-110 transition-transform">
                            {owner.firstName?.[0] || 'O'}{owner.lastName?.[0] || ''}
                          </div>
                          <div>
                            <p className="text-base font-black text-neutral-900">
                              {owner.firstName} {owner.lastName}
                            </p>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-tight antialiased">{owner.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Managers */}
              {(() => {
                let managersList: any[] = [];
                try {
                  managersList = typeof selectedCompany.managers === 'string'
                    ? JSON.parse(selectedCompany.managers)
                    : selectedCompany.managers;
                } catch {
                  managersList = Array.isArray(selectedCompany.managers) ? selectedCompany.managers : [];
                }
                return managersList.length > 0 ? (
                  <div className="border-t border-neutral-100 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <User className="w-5 h-5 text-neutral-900" />
                      <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Managers</h3>
                    </div>
                    <div className="space-y-3">
                      {managersList.map((manager: any, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 group hover:border-neutral-900 transition-all">
                          <p className="text-base font-black text-neutral-900">
                            {manager.firstName} {manager.lastName}
                          </p>
                          <p className="text-xs text-neutral-400 font-bold uppercase tracking-tight antialiased">{manager.email}</p>
                          <p className="text-xs text-neutral-400 font-bold uppercase tracking-tight antialiased">{manager.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Legal Documents Quick Access */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FileText className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-6 h-6 text-blue-100" />
                      <h3 className="text-2xl font-black tracking-tight">Access Legal Documents</h3>
                    </div>
                    <p className="text-blue-50 max-w-lg font-medium leading-relaxed">Your articles of organization, operating agreements, and filed state documents are securely stored in your message inbox.</p>
                  </div>
                  <button
                    onClick={() => router.push('/user/inbox')}
                    className="px-8 py-4 bg-white text-blue-600 text-sm font-black rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
                  >
                    Go to Inbox
                    <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedCompany(null);
                }}
                className="px-8 py-3 bg-neutral-900 text-white font-black rounded-2xl hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




