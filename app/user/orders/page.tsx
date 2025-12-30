
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2, Eye, Download, X, Building2, User, MapPin, FileCheck, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { generateOrderPDF } from '../../utils/pdfGenerator';

interface Order {
  id: number;
  order_number: string;
  tx_ref?: string;
  company_name: string;
  state: string;
  state_fee?: number;
  management_type?: string;
  amount: number;
  status: string;
  contact_email?: string;
  contact_phone?: string;
  account_email?: string;
  created_at: string;
  updated_at: string;
  // Full details (optional initially)
  physical_address?: any;
  mailing_address?: any;
  owners?: any[];
  managers?: any[];
  additional_services?: any;
  same_as_physical?: boolean;
  physical_registered_agent?: boolean;
  physical_agent_address?: string;
  mailing_registered_agent?: boolean;
  mailing_agent_address?: string;
  payment_method?: string;
  purpose?: string;
}

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fullOrderDetails, setFullOrderDetails] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/orders');

      if (response.status === 401) {
        router.push('/');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(`/api/orders/get?orderId=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setFullOrderDetails(data.order);
      }
    } catch (e) {
      console.error("Failed to fetch details", e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setFullOrderDetails(null); // Reset prev details
    setIsViewModalOpen(true);
    fetchOrderDetails(order.id);
  };

  const handleDownloadPDF = async (order: Order) => {
    try {
      // Fetch full order details
      const response = await fetch(`/api/orders/get?orderId=${order.id}`);
      if (response.ok) {
        const data = await response.json();
        generateOrderPDF(data.order);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
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
          <h1 className="text-4xl font-black text-neutral-900 mb-2">My Orders</h1>
          <p className="text-neutral-600">View all your LLC formation orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Order Number</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">State</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-600">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-bold text-neutral-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900">{order.company_name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-700">{order.state}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-neutral-900">${parseFloat(String(order.amount || 0)).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 ${getStatusColor(order.status || 'pending')}`}>
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(order)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
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

      {/* Order Details Modal */}
      {isViewModalOpen && (selectedOrder || fullOrderDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-neutral-900 leading-tight">Order Details</h3>
                  <p className="text-sm text-neutral-500 font-medium">#{fullOrderDetails?.order_number || selectedOrder?.order_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {fullOrderDetails && (
                  <button
                    onClick={() => generateOrderPDF(fullOrderDetails as any)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                )}
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              {detailsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
              ) : fullOrderDetails ? (
                <div className="space-y-8">
                  {/* Order Status & Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black border-2 ${getStatusColor(fullOrderDetails.status || 'processing')}`}>
                        {(fullOrderDetails.status || 'processing').charAt(0).toUpperCase() + (fullOrderDetails.status || 'processing').slice(1)}
                      </span>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Amount</p>
                      <p className="text-lg font-black text-neutral-900">${parseFloat(String(fullOrderDetails.amount || 0)).toFixed(2)}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Payment Method</p>
                      <p className="text-sm font-bold text-neutral-900 capitalize">{fullOrderDetails.payment_method || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Order Date</p>
                      <p className="text-sm font-bold text-neutral-900">{new Date(fullOrderDetails.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-neutral-900" />
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Company Name</p>
                        <p className="text-sm font-bold text-neutral-900">{fullOrderDetails.company_name}</p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State</p>
                        <p className="text-sm font-bold text-neutral-900">{fullOrderDetails.state}</p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State Fee</p>
                        <p className="text-sm font-bold text-neutral-900">${parseFloat(String(fullOrderDetails.state_fee || 0)).toFixed(2)}</p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Management Type</p>
                        <p className="text-sm font-bold text-neutral-900 capitalize">{fullOrderDetails.management_type?.replace('-', ' ') || 'N/A'}</p>
                      </div>
                      {fullOrderDetails.purpose && (
                        <div className="md:col-span-2 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                          <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Purpose</p>
                          <p className="text-sm text-neutral-900">{fullOrderDetails.purpose}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-neutral-900" />
                      Addresses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Physical Address</p>
                        <p className="text-sm text-neutral-900 bg-neutral-50 p-4 rounded-xl border border-neutral-100 leading-relaxed font-medium min-h-[100px] whitespace-pre-line">
                          {(() => {
                            const addr = fullOrderDetails.physical_address;
                            if (!addr) return 'N/A';
                            if (typeof addr === 'object' && addr !== null) {
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
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Mailing Address</p>
                        <p className="text-sm text-neutral-900 bg-neutral-50 p-4 rounded-xl border border-neutral-100 leading-relaxed font-medium min-h-[100px] whitespace-pre-line">
                          {fullOrderDetails.same_as_physical ? 'Same as Physical Address' : (() => {
                            const addr = fullOrderDetails.mailing_address;
                            if (!addr) return 'N/A';
                            if (typeof addr === 'object' && addr !== null) {
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
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-neutral-900" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Email</p>
                        <p className="text-sm font-bold text-neutral-900">{fullOrderDetails.contact_email}</p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Phone</p>
                        <p className="text-sm font-bold text-neutral-900">{fullOrderDetails.contact_phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Owners */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-neutral-900" />
                      Owners / Members
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(Array.isArray(fullOrderDetails.owners) ? fullOrderDetails.owners : []).map((owner: any, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 hover:border-neutral-900 transition-all">
                          <p className="text-sm font-bold text-neutral-900">
                            {owner.firstName} {owner.lastName}
                          </p>
                          <p className="text-xs text-neutral-600">{owner.email}</p>
                          <p className="text-xs text-neutral-600">{owner.phone}</p>
                          {owner.address && (
                            <p className="text-[10px] text-neutral-500 mt-2 italic">{owner.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Managers */}
                  {fullOrderDetails.managers && fullOrderDetails.managers.length > 0 && (
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-neutral-900" />
                        Managers
                      </h3>
                      <div className="space-y-3">
                        {fullOrderDetails.managers.map((manager: any, index: number) => (
                          <div key={index} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
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
                  )}

                  {/* Additional Services */}
                  {fullOrderDetails.additional_services && Object.keys(fullOrderDetails.additional_services).some(key => fullOrderDetails.additional_services[key]) && (
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-neutral-900" />
                        Additional Services
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {fullOrderDetails.additional_services.ein && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">EIN</span>
                        )}
                        {fullOrderDetails.additional_services.website && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold border border-purple-200">Website</span>
                        )}
                        {fullOrderDetails.additional_services.itin && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200">ITIN</span>
                        )}
                        {fullOrderDetails.additional_services.branding && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold border border-orange-200">Branding</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="border-t border-neutral-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Created At</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {new Date(fullOrderDetails.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Last Updated</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {new Date(fullOrderDetails.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                  <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8" />
                  </div>
                  <p className="font-bold">Failed to load order details.</p>
                  <p className="text-xs">Please try again or contact support.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all font-bold text-sm shadow-md active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


