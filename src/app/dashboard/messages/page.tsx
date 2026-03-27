'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Message } from '@/domain/message/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CustomerMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function fetchMessages() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.messages.list();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;

    setSending(true);
    setSendError(null);

    try {
      await api.messages.send({
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        subject: subject.trim() || 'General Enquiry',
        body: body.trim(),
        direction: 'outbound',
        read: false,
      });
      setSubject('');
      setBody('');
      await fetchMessages();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {/* Message thread */}
          <Card className="max-w-2xl">
            <div className="space-y-4 max-h-[28rem] overflow-y-auto px-1">
              {messages.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">
                  No messages yet. Send a message below to get in touch.
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.direction === 'outbound'
                        ? 'bg-brand-green-400 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {msg.subject && (
                      <p className={`text-xs font-semibold mb-1 ${
                        msg.direction === 'outbound' ? 'text-brand-green-100' : 'text-gray-500'
                      }`}>
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                    <p className={`text-xs mt-1 ${
                      msg.direction === 'outbound' ? 'text-brand-green-100' : 'text-gray-400'
                    }`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* New message form */}
          <Card className="max-w-2xl">
            <form onSubmit={handleSend} className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Send a Message</h2>

              {messages.length === 0 && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="msg-subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="msg-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is your message about?"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="msg-body" className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="msg-body"
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message here..."
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400 resize-y"
                />
              </div>

              {sendError && (
                <p className="text-sm text-red-600" role="alert">
                  {sendError}
                </p>
              )}

              <Button type="submit" variant="primary" size="sm" disabled={sending || !body.trim()}>
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
