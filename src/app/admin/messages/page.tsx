'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Message } from '@/domain/message/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type FilterTab = 'all' | 'unread';

interface CustomerThread {
  customerId: string;
  customerName: string;
  customerEmail: string;
  messages: Message[];
  unreadCount: number;
  lastMessage: Message;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
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

  const threads = useMemo(() => {
    const threadMap = new Map<string, CustomerThread>();

    messages.forEach((msg) => {
      const existing = threadMap.get(msg.customerId);
      if (existing) {
        existing.messages.push(msg);
        if (!msg.read && msg.direction === 'outbound') {
          existing.unreadCount++;
        }
        if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          existing.lastMessage = msg;
        }
      } else {
        threadMap.set(msg.customerId, {
          customerId: msg.customerId,
          customerName: msg.customerName,
          customerEmail: msg.customerEmail,
          messages: [msg],
          unreadCount: !msg.read && msg.direction === 'outbound' ? 1 : 0,
          lastMessage: msg,
        });
      }
    });

    const threadsList = Array.from(threadMap.values());
    threadsList.sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime(),
    );

    if (activeTab === 'unread') {
      return threadsList.filter((t) => t.unreadCount > 0);
    }

    return threadsList;
  }, [messages, activeTab]);

  const selectedThreadData = threads.find((t) => t.customerId === selectedThread);

  async function handleMarkRead(messageId: string) {
    try {
      await api.messages.markRead(messageId);
      await fetchMessages();
    } catch {
      // Silently fail for mark-read
    }
  }

  async function handleReply() {
    if (!user || !selectedThreadData || !replyBody.trim()) return;

    setSending(true);
    setSendError(null);

    try {
      await api.messages.send({
        customerId: selectedThreadData.customerId,
        customerName: selectedThreadData.customerName,
        customerEmail: selectedThreadData.customerEmail,
        subject: selectedThreadData.lastMessage.subject,
        body: replyBody.trim(),
        direction: 'inbound',
        read: false,
      });
      setReplyBody('');
      await fetchMessages();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  }

  // When selecting a thread, mark unread messages as read
  function handleSelectThread(customerId: string) {
    setSelectedThread(customerId);
    const thread = threads.find((t) => t.customerId === customerId);
    if (thread) {
      thread.messages
        .filter((m) => !m.read && m.direction === 'outbound')
        .forEach((m) => handleMarkRead(m.id));
    }
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {([
          { key: 'all' as const, label: 'All' },
          { key: 'unread' as const, label: 'Unread' },
        ]).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-brand-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Thread list */}
        <div className="md:col-span-1">
          <Card padding={false}>
            {threads.length === 0 ? (
              <p className="text-sm text-gray-500 p-6 text-center">No messages found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {threads.map((thread) => (
                  <li key={thread.customerId}>
                    <button
                      type="button"
                      onClick={() => handleSelectThread(thread.customerId)}
                      className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 ${
                        selectedThread === thread.customerId ? 'bg-brand-green-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {thread.customerName}
                        </p>
                        {thread.unreadCount > 0 && (
                          <Badge variant="green">{thread.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {thread.lastMessage.body.slice(0, 60)}
                        {thread.lastMessage.body.length > 60 ? '...' : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTime(thread.lastMessage.createdAt)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Thread detail */}
        <div className="md:col-span-2">
          {!selectedThreadData ? (
            <Card>
              <p className="text-sm text-gray-500 text-center py-8">
                Select a conversation to view messages.
              </p>
            </Card>
          ) : (
            <Card>
              <div className="mb-4 pb-3 border-b border-gray-100">
                <p className="text-base font-semibold text-gray-900">
                  {selectedThreadData.customerName}
                </p>
                <p className="text-xs text-gray-500">{selectedThreadData.customerEmail}</p>
              </div>

              {/* Messages */}
              <div className="space-y-4 max-h-[24rem] overflow-y-auto px-1 mb-4">
                {selectedThreadData.messages
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.direction === 'inbound'
                            ? 'bg-brand-green-400 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {msg.subject && (
                          <p className={`text-xs font-semibold mb-1 ${
                            msg.direction === 'inbound' ? 'text-brand-green-100' : 'text-gray-500'
                          }`}>
                            {msg.subject}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                        <p className={`text-xs mt-1 ${
                          msg.direction === 'inbound' ? 'text-brand-green-100' : 'text-gray-400'
                        }`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Reply form */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex flex-col gap-3">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={3}
                    placeholder="Type your reply..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400 resize-y"
                  />

                  {sendError && (
                    <p className="text-sm text-red-600" role="alert">{sendError}</p>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleReply}
                      disabled={sending || !replyBody.trim()}
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
