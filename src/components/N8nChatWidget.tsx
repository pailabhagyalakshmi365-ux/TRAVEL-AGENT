import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Maximize2,
  MessageSquare,
  Minimize2,
  Plane,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { DESTINATIONS } from '../data/worldTripData';
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

/**
 * Lightweight inline Markdown renderer for n8n AI Travel Planner output
 * Supports **bold**, headings (###), bullet lists, and numbered lists cleanly.
 */
function renderFormattedLine(line: string, idx: number) {
  const trimmed = line.trim();
  if (!trimmed) {
    return <div key={idx} className="h-2" />;
  }

  const formatInlineBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  if (trimmed.startsWith('### ')) {
    return (
      <h4
        key={idx}
        className="font-display text-sm font-bold text-slate-900 mt-2.5 mb-1"
      >
        {formatInlineBold(trimmed.slice(4))}
      </h4>
    );
  }

  if (trimmed.startsWith('## ')) {
    return (
      <h3
        key={idx}
        className="font-display text-base font-bold text-slate-900 mt-3 mb-1"
      >
        {formatInlineBold(trimmed.slice(3))}
      </h3>
    );
  }

  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
        <span className="text-sky-600 font-bold mt-0.5">•</span>
        <span className="flex-1">{formatInlineBold(trimmed.slice(2))}</span>
      </div>
    );
  }

  const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numberedMatch) {
    return (
      <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
        <span className="font-mono text-[11px] font-bold text-sky-700 mt-0.5 shrink-0">
          {numberedMatch[1]}.
        </span>
        <span className="flex-1">{formatInlineBold(numberedMatch[2])}</span>
      </div>
    );
  }

  return (
    <p key={idx} className="leading-relaxed">
      {formatInlineBold(trimmed)}
    </p>
  );
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  trip,
  activeCurrency,
  isOpen,
  onToggleOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() =>
    getOrCreateSessionId()
  );
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! Welcome to World Explorer. I am your AI Travel Planner, and I'm here to help you design the perfect international getaway from India.\n\nTo get started, share a few details about your dream trip or click **"Send My Current Trip Plan"** below:\n1. **Where are you traveling from (starting city in India)?**\n2. **Which country or cities do you have in mind?**\n3. **How many days** do you plan to travel, and around **when**?\n4. **Who is traveling** with you (solo, couple, family)?\n5. What is your preferred **travel style** (Budget, Standard, or Luxury)?`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const buildCurrentTripPrompt = () => {
    const cityNames = trip.selectedCityIds
      .map((id) => {
        const d = DESTINATIONS.find((dest) => dest.id === id);
        return d ? `${d.city} (${d.country})` : id;
      })
      .join(', ');

    return `I am traveling from ${trip.startingLocation.city}, India. I want to visit ${cityNames} for ${trip.itinerary.length} days starting around ${trip.startDate}. We are ${trip.travelers} traveler(s) and our preferred travel style is ${trip.travelStyle} (budget in ${activeCurrency}, interests: ${trip.interests.join(', ')}). Please help plan our custom itinerary and budget tips!`;
  };

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
        }),
      });

      const rawText = await response.text();
      if (!response.ok) {
        throw new Error(
          `n8n webhook returned status ${response.status}. Please check that the n8n workflow is active.`
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
          text: `Connection error: ${message}`,
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
    const nextId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
        text: `Started a new conversation session! Share your starting city in India, destination countries, number of days, traveler count, and travel style (${trip.travelStyle}) to build your itinerary.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      label: 'Send My Current Trip Plan',
      prompt: buildCurrentTripPrompt(),
      highlight: true,
    },
    {
      label: '7-Day Dubai & Paris Couple Trip from Hyderabad',
      prompt:
        'We are a couple traveling from Hyderabad, India to Dubai and Paris for 7 days in November with a Standard travel style. Please suggest an itinerary and budget.',
      highlight: false,
    },
    {
      label: '10-Day Japan & Singapore Family Itinerary',
      prompt:
        'We are a family of 4 traveling from Mumbai, India to Tokyo and Singapore for 10 days on a Standard budget. What day-by-day plan and vegetarian food spots do you recommend?',
      highlight: false,
    },
    {
      label: 'Visa Checklist for Indian Passport',
      prompt:
        'What are the visa requirements and processing times for Indian citizens visiting UAE, France (Schengen), UK, USA, Japan, and Singapore?',
      highlight: false,
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label="World Explorer AI Travel Planner Chat"
          className={`mb-3 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'w-[92vw] sm:w-[680px] h-[80vh] max-h-[760px]'
              : 'w-[92vw] sm:w-[430px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight truncate">
                  World Explorer AI Travel Planner
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>Connected to n8n Cloud Agent</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetSession}
                title="Start new chat session"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? 'Compact size' : 'Expand chat window'}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
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

          {/* Active Trip Context Strip */}
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <Plane className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span className="truncate">
                Active Route: <strong>{trip.startingLocation.city}</strong> →{' '}
                {trip.selectedCityIds.length} Countries ({trip.itinerary.length}d ·{' '}
                {trip.travelStyle})
              </span>
            </div>
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleSendMessage(buildCurrentTripPrompt())}
              className="text-sky-700 hover:text-sky-900 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sync Trip →
            </button>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] ${
                    msg.sender === 'user'
                      ? 'bg-sky-700 text-white rounded-br-xs leading-relaxed whitespace-pre-wrap'
                      : msg.isError
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs space-y-1'
                  }`}
                >
                  {msg.sender === 'user'
                    ? msg.text
                    : msg.text
                        .split('\n')
                        .map((line, i) => renderFormattedLine(line, i))}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.sender === 'assistant' ? 'AI Travel Planner · ' : 'You · '}
                    {msg.timestamp}
                  </span>
                  {msg.sender === 'assistant' && !msg.isError && (
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-[10px] text-slate-400 hover:text-slate-700 inline-flex items-center gap-0.5 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
                  <span>AI Travel Planner is crafting your response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {quickPrompts.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isSending}
                onClick={() => handleSendMessage(item.prompt)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  item.highlight
                    ? 'bg-orange-600 text-white hover:bg-orange-500'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me your starting city, destinations, days & style..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
              className="px-3.5 py-2.5 bg-sky-700 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="h-12 px-5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageSquare className="w-4 h-4" />
        <span>
          {isOpen ? 'Close AI Travel Planner' : 'AI Travel Planner Chat'}
        </span>
      </button>
    </div>
  );
};
