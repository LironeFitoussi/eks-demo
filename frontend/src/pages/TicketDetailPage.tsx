import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import api from '../api/axios';
import { TicketStatus, UserRole } from '../types';
import type { Ticket, Comment, User } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  const [assignUpdate, setAssignUpdate] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const isAgentOrAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.AGENT;

  useEffect(() => {
    api.get<Ticket>(`/tickets/${id}`)
      .then((res) => {
        setTicket(res.data);
        setStatusUpdate(res.data.status);
        setAssignUpdate(res.data.assignedTo?.id || '');
      })
      .catch(() => setError('Failed to load ticket.'))
      .finally(() => setLoading(false));

    if (isAgentOrAdmin) {
      api.get<User[]>('/users', { params: { role: 'agent' } })
        .then((res) => setAgents(res.data))
        .catch(() => {});
    }
  }, [id, isAgentOrAdmin]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post<Comment>(`/tickets/${id}/comments`, { content: newComment });
      setTicket((prev) => prev ? { ...prev, comments: [...prev.comments, res.data] } : prev);
      setNewComment('');
    } catch {
      setError('Failed to add comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    try {
      const res = await api.patch<Ticket>(`/tickets/${id}`, {
        status: statusUpdate || undefined,
        assignedToId: assignUpdate || undefined,
      });
      setTicket(res.data);
      setUpdateMsg('Ticket updated successfully.');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch {
      setError('Failed to update ticket.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center mt-16 text-gray-500">Loading ticket...</p>
    </div>
  );

  if (error && !ticket) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <p className="text-center mt-16 text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/tickets')}
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-flex items-center gap-1"
        >
          ← Back to Tickets
        </button>

        {ticket && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{ticket.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Department</span>
                  <p className="font-medium text-gray-900">{ticket.department}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created By</span>
                  <p className="font-medium text-gray-900">{ticket.createdBy.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Assigned To</span>
                  <p className="font-medium text-gray-900">{ticket.assignedTo?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created</span>
                  <p className="font-medium text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((a) => (
                      <a
                        key={a.id}
                        href={a.url}
                        className="text-blue-600 text-sm hover:underline border border-blue-200 rounded px-2 py-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {a.filename}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {isAgentOrAdmin && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Update Ticket</p>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Status</label>
                      <select
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.values(TicketStatus).map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                    {agents.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Assign To</label>
                        <select
                          value={assignUpdate}
                          onChange={(e) => setAssignUpdate(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Unassigned</option>
                          {agents.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      onClick={handleUpdateTicket}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Update
                    </button>
                    {updateMsg && <span className="text-green-600 text-sm">{updateMsg}</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({ticket.comments.length})
              </h2>
              <div className="space-y-4 mb-6">
                {ticket.comments.length === 0 && (
                  <p className="text-gray-400 text-sm">No comments yet.</p>
                )}
                {ticket.comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                      {c.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{c.author.name}</span>
                        <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddComment} className="border-t border-gray-100 pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
