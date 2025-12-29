'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Eye, ChevronDown, X, Download } from 'lucide-react';
import { generateOrderPDF } from '../../utils/pdfGenerator';

interface Order {
  id: number;
  order_number: string;
  tx_ref?: string;
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
  amount: number;
  status: string;
  payment_method: string;
  physical_registered_agent?: boolean;
  physical_agent_address?: string;
  mailing_registered_agent?: boolean;
  mailing_agent_address?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
  user_info?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/api/admin/orders?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/orders';

      const response = await fetch(url);

      if (response.status === 401) {
        router.push('/admin-login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setStatusUpdating(orderId);
    setError(null);

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update order status');
        setStatusUpdating(null);
        return;
      }

      setSuccess('Order status updated successfully');
      fetchOrders();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleDownloadPDF = (order: Order) => {
    try {
      generateOrderPDF(order);
      setSuccess('PDF downloaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
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
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-bold">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-bold">{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 mb-2">Orders</h1>
          <p className="text-neutral-600">View and manage all customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search orders by order number, company name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-neutral-900 focus:outline-none transition-all text-black placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Order Number</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">User</th>
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
                    {searchQuery ? 'No orders found matching your search' : 'No orders found'}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-all duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-bold text-neutral-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{order.company_name}</p>
                        <p className="text-xs text-neutral-500">{order.state}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.user_info ? (
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {order.user_info.firstName} {order.user_info.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">{order.user_info.email}</p>
                        </div>
                      ) : order.user ? (
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">{order.user.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-neutral-900">Guest</p>
                          <p className="text-xs text-neutral-500">{order.contact_email || order.account_email || 'N/A'}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-neutral-900">${parseFloat(String(order.amount || 0)).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={order.status || 'processing'}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={statusUpdating === order.id}
                          className={`appearance-none px-3 py-1.5 rounded-full text-xs font-black border-2 cursor-pointer transition-all ${getStatusColor(order.status || 'processing')
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {statusUpdating === order.id && (
                          <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 transition-all"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                          PDF
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
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">Order Details</h2>
                  <p className="text-sm text-neutral-600 mt-1">Order #{selectedOrder.order_number}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(selectedOrder)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedOrder(null);
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Status</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black border-2 ${getStatusColor(selectedOrder.status || 'processing')}`}>
                    {(selectedOrder.status || 'processing').charAt(0).toUpperCase() + (selectedOrder.status || 'processing').slice(1)}
                  </span>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Amount</p>
                  <p className="text-lg font-black text-neutral-900">${parseFloat(selectedOrder.amount.toString()).toFixed(2)}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Payment Method</p>
                  <p className="text-sm font-bold text-neutral-900 capitalize">{selectedOrder.payment_method || 'N/A'}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Transaction Ref</p>
                  <p className="text-sm font-mono text-neutral-900">{selectedOrder.tx_ref || 'N/A'}</p>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Company Name</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedOrder.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedOrder.state}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">State Fee</p>
                    <p className="text-sm font-bold text-neutral-900">${parseFloat(selectedOrder.state_fee.toString()).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Management Type</p>
                    <p className="text-sm font-bold text-neutral-900 capitalize">{selectedOrder.management_type?.replace('-', ' ') || 'N/A'}</p>
                  </div>
                  {selectedOrder.purpose && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Purpose</p>
                      <p className="text-sm text-neutral-900">{selectedOrder.purpose}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Addresses */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Physical Address</p>
                    <p className="text-sm text-neutral-900 bg-neutral-50 p-4 rounded-xl border border-neutral-100 leading-relaxed font-medium">
                      {(() => {
                        const addr = selectedOrder.physical_address;
                        if (!addr) return 'N/A';
                        if (typeof addr === 'object' && addr !== null) {
                          const a = addr as any;
                          return `${a.street || ''}\n${a.city || ''}, ${a.state || ''} ${a.zip || ''}`.trim() || 'N/A';
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
                    {selectedOrder.physical_registered_agent && (
                      <div className="mt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1 whitespace-nowrap">Registered Agent</p>
                        <p className="text-xs font-medium text-neutral-700 whitespace-pre-wrap">{selectedOrder.physical_agent_address || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Mailing Address</p>
                    <p className="text-sm text-neutral-900 bg-neutral-50 p-4 rounded-xl border border-neutral-100 leading-relaxed font-medium">
                      {selectedOrder.same_as_physical ? 'Same as Physical' : (() => {
                        const addr = selectedOrder.mailing_address;
                        if (!addr) return 'N/A';
                        if (typeof addr === 'object' && addr !== null) {
                          const a = addr as any;
                          return `${a.street || ''}\n${a.city || ''}, ${a.state || ''} ${a.zip || ''}`.trim() || 'N/A';
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
                    {!selectedOrder.same_as_physical && selectedOrder.mailing_registered_agent && (
                      <div className="mt-2 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                        <p className="text-[10px] font-black text-purple-600 uppercase mb-1 whitespace-nowrap">Registered Agent</p>
                        <p className="text-xs font-medium text-neutral-700 whitespace-pre-wrap">{selectedOrder.mailing_agent_address || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Owners */}
              {selectedOrder.owners && selectedOrder.owners.length > 0 && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">Owners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      let ownersList: any[] = [];
                      try {
                        ownersList = typeof selectedOrder.owners === 'string'
                          ? JSON.parse(selectedOrder.owners)
                          : selectedOrder.owners;
                      } catch {
                        ownersList = Array.isArray(selectedOrder.owners) ? selectedOrder.owners : [];
                      }
                      return (Array.isArray(ownersList) ? ownersList : []).map((owner: any, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                          <p className="text-sm font-bold text-neutral-900">
                            {owner.firstName} {owner.lastName}
                          </p>
                          <p className="text-xs text-neutral-600">{owner.email}</p>
                          <p className="text-xs text-neutral-600">{owner.phone}</p>
                          {owner.address && (
                            <p className="text-[10px] text-neutral-500 mt-2 italic">{owner.address}</p>
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Managers */}
              {selectedOrder.managers && selectedOrder.managers.length > 0 && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">Managers</h3>
                  <div className="space-y-3">
                    {selectedOrder.managers.map((manager: any, index: number) => (
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
              )}

              {/* Contact Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-black text-neutral-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Email</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedOrder.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Contact Phone</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedOrder.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Account Email</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedOrder.account_email}</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              {selectedOrder.additional_services && Object.keys(selectedOrder.additional_services).some(key => selectedOrder.additional_services[key]) && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">Additional Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.additional_services.ein && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">EIN</span>
                    )}
                    {selectedOrder.additional_services.website && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Website</span>
                    )}
                    {selectedOrder.additional_services.itin && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ITIN</span>
                    )}
                    {selectedOrder.additional_services.branding && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Branding</span>
                    )}
                  </div>
                </div>
              )}

              {/* User Information */}
              {(selectedOrder.user_info || selectedOrder.user) ? (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">User Account</h3>
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-neutral-900">
                      {selectedOrder.user_info?.firstName || selectedOrder.user?.firstName} {selectedOrder.user_info?.lastName || selectedOrder.user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-600">{selectedOrder.user_info?.email || selectedOrder.user?.email}</p>
                    {selectedOrder.user?.phone && (
                      <p className="text-xs text-neutral-600">{selectedOrder.user.phone}</p>
                    )}
                    {(!selectedOrder.user) && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Guest Customer</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-black text-neutral-900 mb-4">User Account</h3>
                  <div className="bg-neutral-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-neutral-900">Guest</p>
                    <p className="text-xs text-neutral-600">{selectedOrder.contact_email || selectedOrder.account_email || 'N/A'}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">No Account Linked</span>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Created At</p>
                    <p className="text-sm text-neutral-900">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase mb-1">Last Updated</p>
                    <p className="text-sm text-neutral-900">
                      {new Date(selectedOrder.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
