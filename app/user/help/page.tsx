'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import { ContactPageClient } from '../../contact/ContactPageClient';

export default function UserHelpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send message');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setFormData({ subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error sending help request:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to contact page when help is clicked
  React.useEffect(() => {
    router.push('/user/contact');
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <HelpCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-600">Redirecting to contact page...</p>
        </div>
      </div>
    </div>
  );
}

