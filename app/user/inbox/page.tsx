'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inbox, FileText, Loader2, Download, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { useConfirm } from '../../hooks/useConfirm';

interface Message {
  id: number;
  subject: string;
  content: string;
  type: string;
  status: string;
  documentUrl?: string;
  documentName?: string;
  documentType?: string;
  created_at: string;
}

export default function UserInboxPage() {
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { showNotification, NotificationComponent } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0 && typeof window !== 'undefined') {
      const firstUnread = messages.find(msg => msg.status === 'unread');
      if (firstUnread) {
        setTimeout(() => {
          const element = document.getElementById(`message-${firstUnread.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/inbox');
      
      if (response.status === 401) {
        router.push('/');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch('/api/user/inbox', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          status: 'read',
        }),
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDownload = (message: Message) => {
    if (message.documentUrl) {
      window.open(message.documentUrl, '_blank');
    }
  };

  const handleDelete = async (messageId: number) => {
    const confirmed = await confirm({
      title: 'Delete Message',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    setDeletingId(messageId);
    try {
      const response = await fetch(`/api/user/inbox?messageId=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        showNotification('success', 'Message deleted successfully', 'Success');
      } else {
        showNotification('error', 'Failed to delete message. Please try again.', 'Error');
      }
    } catch (error) {
      showNotification('error', 'Failed to delete message. Please check your connection and try again.', 'Error');
    } finally {
      setDeletingId(null);
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
    <>
      {NotificationComponent}
      {ConfirmComponent}
      <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">Inbox</h1>
        <p className="text-sm text-neutral-600">Your messages and documents from admin</p>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-white" />
            </div>
            <p className="text-neutral-600 font-semibold">No messages found</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              id={`message-${message.id}`}
              className={`group bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 hover:shadow-xl ${
                message.status === 'unread'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => {
                if (message.status === 'unread') {
                  markAsRead(message.id);
                }
              }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {message.documentUrl ? (
                      <FileText className="w-6 h-6 text-white" />
                    ) : (
                      <Inbox className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-black text-neutral-900 truncate">{message.subject}</h3>
                          {message.status === 'unread' && (
                            <span className="w-2 h-2 bg-neutral-900 rounded-full flex-shrink-0"></span>
                          )}
                          {message.documentUrl && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white">
                              Document
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 line-clamp-2 mb-2">{message.content}</p>
                        {message.documentName && (
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate">{message.documentName}</span>
                          </div>
                        )}
                        <p className="text-xs text-neutral-400">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {message.documentUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(message);
                            }}
                            className="p-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all duration-300 shadow-sm hover:shadow-md group/btn"
                            title="Download document"
                          >
                            <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          disabled={deletingId === message.id}
                          className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          title="Delete message"
                        >
                          {deletingId === message.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}
