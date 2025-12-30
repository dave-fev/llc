'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  onClose: () => void;
  duration?: number;
}

export function Notification({ type, message, title, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      titleColor: 'text-emerald-900',
      messageColor: 'text-emerald-800',
      closeColor: 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-500',
      iconColor: 'text-white',
      titleColor: 'text-red-900',
      messageColor: 'text-red-800',
      closeColor: 'text-red-600 hover:text-red-900 hover:bg-red-100',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-800',
      closeColor: 'text-amber-600 hover:text-amber-900 hover:bg-amber-100',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-800',
      closeColor: 'text-blue-600 hover:text-blue-900 hover:bg-blue-100',
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right fade-in duration-300 max-w-md w-full sm:w-auto">
      <div className={`${style.bgColor} ${style.borderColor} border-2 rounded-2xl shadow-2xl p-5 backdrop-blur-sm`}>
        <div className="flex items-start gap-4">
          <div className={`${style.iconBg} rounded-xl p-2.5 flex-shrink-0 shadow-lg`}>
            <Icon className={`w-5 h-5 ${style.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`${style.titleColor} font-black text-base mb-1`}>
                {title}
              </h4>
            )}
            <p className={`${style.messageColor} text-sm font-semibold leading-relaxed`}>
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`${style.closeColor} p-1.5 rounded-lg transition-all duration-200 flex-shrink-0`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmDialogProps) {
  const config = {
    danger: {
      confirmBg: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    warning: {
      confirmBg: 'bg-amber-600 hover:bg-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    info: {
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  };

  const style = config[type];
  const Icon = type === 'danger' ? XCircle : AlertCircle;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-4 mb-6">
          <div className={`${style.iconBg} rounded-xl p-3 flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${style.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-neutral-900 mb-2">{title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 ${style.confirmBg} text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}




