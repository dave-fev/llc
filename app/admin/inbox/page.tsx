'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Search, RefreshCw, Loader2, FileText, User } from 'lucide-react';

interface Message {
    id: number;
    subject: string;
    content: string;
    status: string;
    created_at: string;
    user_name: string;
    user_email: string;
    document_url?: string;
}

export default function InboxPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
            const response = await fetch(`/api/admin/messages${query}`);
            const data = await response.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMessages();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900 mb-2">Inbox</h1>
                    <p className="text-neutral-600">Manage user inquiries and messages.</p>
                </div>
                <button
                    onClick={() => fetchMessages()}
                    className="p-2 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm self-start md:self-auto"
                >
                    <RefreshCw className={`w-5 h-5 text-neutral-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">

                {/* Message List */}
                <div className={`
          flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col
          ${selectedMessage ? 'hidden lg:flex' : 'flex'}
        `}>
                    {/* Search Bar */}
                    <div className="p-4 border-b border-neutral-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading && messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-8 text-center">
                                <Mail className="w-12 h-12 mb-4 opacity-20" />
                                <p>No messages found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-neutral-100">
                                {messages.map((message) => (
                                    <button
                                        key={message.id}
                                        onClick={() => setSelectedMessage(message)}
                                        className={`
                      w-full text-left p-4 hover:bg-neutral-50 transition-colors flex gap-4 items-start
                      ${selectedMessage?.id === message.id ? 'bg-neutral-50 border-l-4 border-neutral-900' : 'border-l-4 border-transparent'}
                    `}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                                            {message.user_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-bold text-neutral-900 truncate ${message.status === 'unread' ? 'text-black' : 'text-neutral-700'}`}>
                                                    {message.user_name}
                                                </h3>
                                                <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                                                    {new Date(message.created_at).toLocaleDateString(undefined, {
                                                        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate mb-1 ${message.status === 'unread' ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>
                                                {message.subject}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate">
                                                {message.content}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail View */}
                <div className={`
          flex-[1.5] bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col
          ${!selectedMessage ? 'hidden lg:flex' : 'flex'}
        `}>
                    {selectedMessage ? (
                        <>
                            {/* Toolbar */}
                            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="lg:hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                                >
                                    ← Back to Inbox
                                </button>
                                <div className="flex gap-2">
                                    {/* Actions like Reply could go here */}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                {/* Header Info */}
                                <div className="flex items-start justify-between mb-8 pb-8 border-b border-neutral-100">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                                            <User className="w-6 h-6 text-neutral-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-neutral-900">{selectedMessage.subject}</h2>
                                            <div className="flex flex-col text-sm text-neutral-500 mt-1">
                                                <span className="font-medium text-neutral-900">{selectedMessage.user_name}</span>
                                                <span>&lt;{selectedMessage.user_email}&gt;</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                        {new Date(selectedMessage.created_at).toLocaleString(undefined, {
                                            dateStyle: 'long',
                                            timeStyle: 'short'
                                        })}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="prose max-w-none text-neutral-800 leading-relaxed mb-8">
                                    {selectedMessage.content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">{line}</p>
                                    ))}
                                </div>

                                {/* Attachments */}
                                {selectedMessage.document_url && (
                                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex items-center gap-4 max-w-md">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">Attachment</p>
                                            {/* <p className="text-xs text-neutral-500">PDF Document</p> */}
                                        </div>
                                        <a
                                            href={selectedMessage.document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors"
                                        >
                                            Download
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-8">
                            <Mail className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg font-medium text-neutral-500">Select a message to read</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
