import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { CurrencyCode, WorldTripPlan } from '../types/travel';

export const N8N_CHAT_WEBHOOK_URL =
  'https://bhagi13.app.n8n.cloud/webhook/0a330948-7667-4e45-8d75-330d9a3b737d/chat';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface N8nChatWidgetProps {
  trip: WorldTripPlan;
  activeCurrency: CurrencyCode;
  isOpen: boolean;
  onToggleOpen: () => void;
}

function getOrCreateSessionId(): string {
  const key = 'world_explorer_n8n_session_id';
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const created =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, created);
    return created;
  } catch {
    return `sess-${Date.now()}`;
  }
}

function extractN8nReply(payload: unknown): string {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return 'Received empty response from n8n workflow.';
    try {
      const parsed = JSON.parse(trimmed);
      return extractN8nReply(parsed);
    } catch {
      return trimmed;
    }
  }

  if (Array.isArray(payload)) {
    if (payload.length === 0) return 'Received empty array from n8n workflow.';
    return extractN8nReply(payload[0]);
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidateKeys = [
      'output',
      'text',
      'response',
      'message',
      'reply',
      'answer',
      'content',
      'data',
    ];
    for (const key of candidateKeys) {
      if (typeof record[key] === 'string' && (record[key] as string).trim()) {
        return (record[key] as string).trim();
      }
    }
    return JSON.stringify(payload, null, 2);
  }

  return 'Message received by n8n webhook.';
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  trip,
  activeCurrency,
  isOpen,
  onToggleOpen,
}) => {
  const [viewMode, setViewMode] = useState<'chat' | 'iframe'>('chat');
  const [sessionId, setSessionId] = useState<string>(() =>
    getOrCreateSessionId()
  );
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I'm your World Explorer Travel Assistant connected via n8n. Ask me anything about your ${trip.startingLocation.city} world trip, visas, itinerary, or budget.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, viewMode]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? input).trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsSending(true);

    try {
      const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId,
          chatInput: textToSend,
          metadata: {
            tripName: trip.name,
            origin: trip.startingLocation.city,
            destinations: trip.selectedCityIds,
            travelStyle: trip.travelStyle,
            travelers: trip.travelers,
            currency: activeCurrency,
          },
        }),
      });

      const rawText = await response.text();
      if (!response.ok) {
        throw new Error(
          `n8n webhook returned status ${response.status}. Ensure the workflow is active or switch to "Hosted View".`
        );
      }

      const replyText = extractN8nReply(rawText);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the n8n webhook endpoint.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `${message} You can also switch to the "Hosted Chat" tab above to interact with the n8n chat page directly.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetSession = () => {
    const nextId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    try {
      sessionStorage.setItem('world_explorer_n8n_session_id', nextId);
    } catch {
      // ignore
    }
    setSessionId(nextId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Started a fresh n8n chat session. How can I help plan your trip from ${trip.startingLocation.city}?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  const quickPrompts = [
    `Suggest tips for my ${trip.startingLocation.city} world trip`,
    'What visas do Indian travelers need for Dubai, Paris & London?',
    'Recommend vegetarian restaurants in Tokyo & Paris',
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {isOpen && (
          <div
            role="dialog"
            aria-label="World Explorer n8n Travel Chat"
            className="mb-3 w-[360px] sm:w-[410px] h-[540px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold leading-tight truncate">
                    World Explorer Live Chat
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono truncate">
                    n8n Webhook Connected
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSession}
                  title="Reset chat session"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <a
                  href={N8N_CHAT_WEBHOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open n8n chat URL in new tab"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onToggleOpen}
                  aria-label="Close chat window"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Bar */}
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('chat')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    viewMode === 'chat'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Interactive Chat
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('iframe')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    viewMode === 'iframe'
                      ? 'bg-sky-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hosted n8n View
                </button>
              </div>
              <span className="font-mono text-[10px] text-slate-500 truncate">
                bhagi13.app.n8n.cloud
              </span>
            </div>

            {/* Mode 1: Native Interactive Webhook Chat */}
            {viewMode === 'chat' ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-sky-700 text-white rounded-br-xs'
                            : msg.isError
                            ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex items-start">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs text-slate-500 font-medium">
                        Waiting for n8n workflow reply...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isSending}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 text-[11px] font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the n8n travel assistant..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    aria-label="Send message"
                    className="p-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              /* Mode 2: Embedded Hosted n8n Chat iFrame */
              <div className="flex-1 flex flex-col bg-slate-50">
                <iframe
                  src={N8N_CHAT_WEBHOOK_URL}
                  title="n8n Hosted Travel Chat"
                  className="w-full flex-1 border-0"
                  allow="clipboard-write"
                />
                <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Connected to n8n Cloud Webhook</span>
                  <a
                    href={N8N_CHAT_WEBHOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sky-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Direct URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onToggleOpen}
          className="h-12 px-4 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isOpen ? 'Close Travel Chat' : 'AI Travel Chat'}</span>
        </button>
      </div>
    </>
  );
};
