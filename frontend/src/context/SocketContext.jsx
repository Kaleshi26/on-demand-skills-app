// frontend/src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && user) {
      const token = localStorage.getItem('token');
      if (token) {
        const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
          console.log('Socket connected');
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnected(false);
        });

        // Listen for new message notifications
        newSocket.on('new-message-notification', (data) => {
          toast.success(`New message from ${data.sender.name}`, {
            duration: 4000,
            position: 'top-right'
          });
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    } else if (ready && !user) {
      // User logged out, close socket
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user, ready]);

  const joinConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('join-conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket && connected) {
      socket.emit('leave-conversation', conversationId);
    }
  };

  const sendMessage = (conversationId, message, recipients) => {
    if (socket && connected) {
      socket.emit('new-message', {
        conversationId,
        message,
        recipients
      });
    }
  };

  const value = {
    socket,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
