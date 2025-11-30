import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
// FIXED: Removed .jsx extension to match Checkout.jsx pattern
import { useAuth } from '../context/AuthContext';

// --- Icons ---
const Icons = {
  Send: () => <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Dots: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>,
  Back: () => <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

// --- Mock Data for Demo ---
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    user: { name: 'Alice M.', avatar: null, online: true },
    lastMessage: 'Great, see you tomorrow at 10 AM!',
    time: '10:30 AM',
    unread: 2,
    service: 'Home Cleaning'
  },
  {
    id: '2',
    user: { name: 'John D.', avatar: null, online: false },
    lastMessage: 'Can you bring extra tools?',
    time: 'Yesterday',
    unread: 0,
    service: 'Furniture Assembly'
  },
  {
    id: '3',
    user: { name: 'Sarah W.', avatar: null, online: true },
    lastMessage: 'Thanks for the quick work!',
    time: 'Mon',
    unread: 0,
    service: 'TV Mounting'
  }
];

const MOCK_MESSAGES = [
  { id: 1, text: "Hi! I saw your request for cleaning.", sender: 'them', time: "10:00 AM" },
  { id: 2, text: "Yes, I need a deep clean for a 2 bedroom apartment.", sender: 'me', time: "10:05 AM" },
  { id: 3, text: "No problem. I have availability tomorrow.", sender: 'them', time: "10:06 AM" },
  { id: 4, text: "Does 10 AM work for you?", sender: 'them', time: "10:06 AM" },
  { id: 5, text: "That works perfectly. Do I need to provide supplies?", sender: 'me', time: "10:10 AM" },
  { id: 6, text: "I bring my own professional equipment. See you then!", sender: 'them', time: "10:12 AM" },
];

export default function Inbox() {
  const { id } = useParams(); // Get conversation ID from URL if present
  const nav = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef(null);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Auto-select chat based on URL ID
  useEffect(() => {
    if (id) {
      const chat = MOCK_CONVERSATIONS.find(c => c.id === id);
      if (chat) setActiveChat(chat);
    } else {
      setActiveChat(null);
    }
  }, [id]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate reply for demo effect
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Thanks! I'll update the booking details.",
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const selectChat = (chatId) => {
    nav(`/inbox/${chatId}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
      <div className="max-w-7xl mx-auto w-full flex bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden my-4 md:my-8 h-[calc(100vh-120px)]">
        
        {/* --- Sidebar (Conversation List) --- */}
        <div className={clsx(
          "w-full md:w-80 border-r border-gray-100 flex flex-col bg-white transition-all",
          activeChat ? "hidden md:flex" : "flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <div className="p-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Icons.Dots />
            </div>
          </div>

          {/* Search */}
          <div className="p-4 pb-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl text-sm transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={clsx(
                  "p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3",
                  activeChat?.id === chat.id ? "bg-blue-50/60 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {chat.user.name.charAt(0)}
                  </div>
                  {chat.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.user.name}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs font-medium text-blue-600 mb-0.5">{chat.service}</p>
                  <div className="flex justify-between items-center">
                    <p className={clsx("text-sm truncate", chat.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500")}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Chat Window --- */}
        <div className={clsx(
          "flex-1 flex flex-col bg-gray-50/30",
          !activeChat ? "hidden md:flex" : "flex"
        )}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => nav('/inbox')}
                    className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <Icons.Back />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {activeChat.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{activeChat.user.name}</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Online now
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  View Booking
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                <div className="text-center py-4">
                  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                    Conversation started regarding {activeChat.service}
                  </span>
                </div>
                
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      "flex w-full",
                      msg.sender === 'me' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={clsx(
                      "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm relative group",
                      msg.sender === 'me' 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    )}>
                      <p>{msg.text}</p>
                      <span className={clsx(
                        "text-[10px] absolute bottom-1 right-2 opacity-0 group-hover:opacity-70 transition-opacity",
                        msg.sender === 'me' ? "text-blue-100" : "text-gray-400"
                      )}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                  <div className="flex-1 bg-gray-100 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white transition-all">
                    <textarea 
                      rows={1}
                      className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm max-h-32"
                      placeholder="Type a message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex-shrink-0"
                  >
                    <Icons.Send />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Select a Conversation</h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                Choose a chat from the left to start messaging your provider.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}