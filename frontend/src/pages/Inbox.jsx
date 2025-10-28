// frontend/src/pages/Inbox.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaComment, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Inbox() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { socket, connected, joinConversation, leaveConversation } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (id) {
      fetchConversation(id);
      fetchMessages(id);
    }
  }, [id]);

  useEffect(() => {
    if (socket && connected && id) {
      joinConversation(id);
      
      const handleMessageReceived = (data) => {
        if (data.conversationId === id) {
          setMessages(prev => [...prev, data.message]);
        }
      };

      socket.on('message-received', handleMessageReceived);

      return () => {
        socket.off('message-received', handleMessageReceived);
        leaveConversation(id);
      };
    }
  }, [socket, connected, id, joinConversation, leaveConversation]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/conversations');
      setConversations(data.conversations);
    } catch (error) {
      console.error('Fetch conversations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (conversationId) => {
    try {
      const { data } = await api.get(`/conversations/${conversationId}`);
      setCurrentConversation(data.conversation);
    } catch (error) {
      console.error('Fetch conversation error:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/conversation/${conversationId}`);
      setMessages(data.messages);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !id) return;

    setSending(true);
    try {
      const { data } = await api.post(`/messages/conversation/${id}`, {
        text: newMessage.trim()
      });

      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      
      // Update conversations list
      fetchConversations();
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherUser = (conversation) => {
    if (!conversation || !user) return null;
    return conversation.members.find(member => member._id !== user._id);
  };

  if (loading) {
    return (
      <div className="container-max py-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="md:col-span-2 h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {id && (
            <Button
              variant="outline"
              onClick={() => navigate('/inbox')}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {conversations.map(conversation => {
                    const otherUser = getOtherUser(conversation);
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => navigate(`/inbox/${conversation._id}`)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          id === conversation._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {otherUser?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {otherUser?.name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                            {conversation.lastMessageAt && (
                              <p className="text-xs text-gray-400">
                                {format(new Date(conversation.lastMessageAt), 'MMM d, h:mm a')}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
            {id && currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {getOtherUser(currentConversation)?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getOtherUser(currentConversation)?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {connected ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === user._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={sending}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                    >
                      <FaPaperPlane className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={FaComment}
                  title="Select a conversation"
                  description="Choose a conversation from the list to start messaging."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
