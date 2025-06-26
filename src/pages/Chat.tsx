
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, Search, Phone, AlertTriangle, Clock, User, Truck } from 'lucide-react';

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
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isEmergency: boolean;
  status: 'online' | 'offline';
}

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      participant: { id: 'driver1', name: 'John Driver', type: 'driver' },
      lastMessage: 'Bus broke down near Central Station',
      lastMessageTime: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      isEmergency: true,
      status: 'online'
    },
    {
      id: '2',
      participant: { id: 'user1', name: 'Sarah User', type: 'user' },
      lastMessage: 'When is the next bus arriving?',
      lastMessageTime: new Date(Date.now() - 15 * 60000),
      unreadCount: 1,
      isEmergency: false,
      status: 'online'
    },
    {
      id: '3',
      participant: { id: 'driver2', name: 'Mike Driver', type: 'driver' },
      lastMessage: 'Route completed successfully',
      lastMessageTime: new Date(Date.now() - 30 * 60000),
      unreadCount: 0,
      isEmergency: false,
      status: 'offline'
    }
  ]);

  const [messages] = useState<Record<string, Message[]>>({
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
      },
      {
        id: '3',
        senderId: 'driver1',
        senderName: 'John Driver',
        senderType: 'driver',
        message: 'Engine overheating. Passengers are safe but need backup bus',
        timestamp: new Date(Date.now() - 5 * 60000),
        isEmergency: true
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
      },
      {
        id: '5',
        senderId: 'admin',
        senderName: 'Admin',
        senderType: 'admin',
        message: 'Hello Sarah! The next bus should arrive in about 8 minutes.',
        timestamp: new Date(Date.now() - 15 * 60000)
      }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const selectedChatRoom = chatRooms.find(room => room.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat Center</h1>
        <p className="text-gray-600 mt-2">Communicate with drivers and users for support and emergencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredChatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedChat(room.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === room.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {room.participant.type === 'driver' ? (
                          <Truck className="h-5 w-5 text-gray-600" />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        room.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {room.participant.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          {room.isEmergency && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {room.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {room.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(room.lastMessageTime)}
                        </p>
                      </div>
                      <Badge variant={room.participant.type === 'driver' ? 'default' : 'secondary'} className="text-xs mt-1">
                        {room.participant.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedChatRoom ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {selectedChatRoom.participant.type === 'driver' ? (
                          <Truck className="h-5 w-5 text-gray-600" />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        selectedChatRoom.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChatRoom.participant.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedChatRoom.participant.type === 'driver' ? 'default' : 'secondary'}>
                          {selectedChatRoom.participant.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {selectedChatRoom.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedChatRoom.isEmergency && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Emergency</span>
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'admin'
                          ? 'bg-blue-600 text-white'
                          : message.isEmergency
                          ? 'bg-red-100 text-red-900 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                          {message.isEmergency && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-end mt-1">
                          <Clock className="h-3 w-3 mr-1 opacity-60" />
                          <span className="text-xs opacity-60">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
