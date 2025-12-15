import React, { useState, useRef, useEffect } from 'react';
import { Truck } from '../types';
import { chatWithFleetAI } from '../services/geminiService';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface FleetChatProps {
  trucks: Truck[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const FleetChat: React.FC<FleetChatProps> = ({ trucks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am monitoring your fleet. Ask me about fuel levels, driver status, or efficiency.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const response = await chatWithFleetAI(userMessage, trucks, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-orca-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-full">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Orca Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-300 font-medium">Fleet Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-3 shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your fleet..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orca-500 focus:outline-none placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-orca-600 text-white rounded-xl hover:bg-orca-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-orca-900 text-white pl-4 pr-2 py-2 rounded-full shadow-xl hover:bg-orca-800 transition-all hover:scale-105 active:scale-95"
        >
          <span className="font-semibold text-sm">Ask AI</span>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition">
            <MessageSquare size={20} fill="currentColor" />
          </div>
        </button>
      )}
    </div>
  );
};