
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, Search, Phone, AlertTriangle, Clock, User, Truck, MessageCircle, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'admin' | 'driver' | 'user';
  message: string;
  timestamp: Date;
  isEmergency?: boolean;
}

interface ChatRoom {
  id: string;
  participant: {
    id: string;
    name: string;
    type: 'driver' | 'user';
    avatar?: string;
    phone?: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isEmergency: boolean;
  status: 'online' | 'offline';
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      participant: { 
        id: 'driver1', 
        name: 'John Driver', 
        type: 'driver',
        phone: '+1234567890'
      },
      lastMessage: 'Bus broke down near Central Station',
      lastMessageTime: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      isEmergency: true,
      status: 'online'
    },
    {
      id: '2',
      participant: { 
        id: 'user1', 
        name: 'Sarah User', 
        type: 'user',
        phone: '+0987654321'
      },
      lastMessage: 'When is the next bus arriving?',
      lastMessageTime: new Date(Date.now() - 15 * 60000),
      unreadCount: 1,
      isEmergency: false,
      status: 'online'
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: 'driver1',
        senderName: 'John Driver',
        senderType: 'driver',
        message: 'Emergency! Bus broke down near Central Station',
        timestamp: new Date(Date.now() - 10 * 60000),
        isEmergency: true
      },
      {
        id: '2',
        senderId: 'admin',
        senderName: 'Admin',
        senderType: 'admin',
        message: 'I see the emergency. What exactly happened?',
        timestamp: new Date(Date.now() - 8 * 60000)
      }
    ],
    '2': [
      {
        id: '4',
        senderId: 'user1',
        senderName: 'Sarah User',
        senderType: 'user',
        message: 'Hi, when is the next bus arriving at Downtown stop?',
        timestamp: new Date(Date.now() - 20 * 60000)
      }
    ]
  });

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) {
      // Actually initiate the call
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert('Phone number not available');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const newMessageObj: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin',
      senderType: 'admin',
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    // Add message to the selected chat
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessageObj]
    }));

    // Update chat room's last message
    setChatRooms(prev => prev.map(room => 
      room.id === selectedChat 
        ? {
            ...room,
            lastMessage: newMessage.trim(),
            lastMessageTime: new Date(),
          }
        : room
    ));

    // Clear input
    setNewMessage('');
    
    console.log('Message sent:', newMessageObj);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleDateString();
  };

  const selectedChatRoom = chatRooms.find(room => room.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];
  const totalUnreadCount = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-xl">
        {/* Header */}
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Center
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-[calc(500px-80px)] flex">
            {!selectedChat ? (
              /* Chat List */
              <div className="w-full">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-8"
                    />
                  </div>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedChat(room.id)}
                      className="p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {room.participant.type === 'driver' ? (
                              <Truck className="h-4 w-4 text-gray-600" />
                            ) : (
                              <User className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                            room.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {room.participant.name}
                            </p>
                            <div className="flex items-center space-x-1">
                              {room.isEmergency && (
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                              )}
                              {room.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs h-4 px-1">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {room.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(room.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Window */
              <div className="w-full flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedChat(null)}
                        className="p-1"
                      >
                        ←
                      </Button>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          {selectedChatRoom?.participant.type === 'driver' ? (
                            <Truck className="h-3 w-3 text-gray-600" />
                          ) : (
                            <User className="h-3 w-3 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{selectedChatRoom?.participant.name}</p>
                          <Badge variant={selectedChatRoom?.participant.type === 'driver' ? 'default' : 'secondary'} className="text-xs">
                            {selectedChatRoom?.participant.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-1"
                      onClick={() => handleCall(selectedChatRoom?.participant.phone)}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.senderType === 'admin'
                          ? 'bg-blue-600 text-white'
                          : message.isEmergency
                          ? 'bg-red-100 text-red-900 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p>{message.message}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[32px] max-h-[80px] text-sm resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingChat;
