import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: 'مرحباً بك! أنا مساعدك الذكي لاستكشاف التراث الأردني. كيف يمكنني مساعدتك اليوم؟',
    sender: 'bot',
    time: now(),
  },
];

const BOT_REPLIES: Record<string, string> = {
  default: 'شكراً على سؤالك! يمكنك استكشاف مواقعنا الأثرية، الأرشيف الرقمي، والخريطة التفاعلية للتعرف أكثر على التراث الأردني.',
  petra: 'البتراء هي إحدى عجائب الدنيا السبع الجديدة، وتقع في جنوب الأردن. تُعرف بمبانيها المنحوتة في الصخر الوردي.',
  jerash: 'جرش تحتضن أحد أكمل المدن الرومانية المحافظة في العالم، وتُقام فيها مهرجانات ثقافية سنوية.',
  مواقع: 'يمكنك تصفح جميع المواقع الأثرية من خلال صفحة "المواقع" أو عبر الخريطة التفاعلية.',
  خريطة: 'تتيح لك خريطتنا التفاعلية استكشاف المواقع الأثرية في جميع أنحاء الأردن بشكل بصري ومباشر.',
  أرشيف: 'يضم أرشيفنا الرقمي آلاف الصور والوثائق والمقتنيات الأثرية الأردنية.',
};

function now(): string {
  return new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' });
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('petra') || lower.includes('بترا') || lower.includes('البتراء')) return BOT_REPLIES.petra;
  if (lower.includes('jerash') || lower.includes('جرش')) return BOT_REPLIES.jerash;
  if (text.includes('مواقع') || text.includes('أثري')) return BOT_REPLIES['مواقع'];
  if (text.includes('خريطة')) return BOT_REPLIES['خريطة'];
  if (text.includes('أرشيف') || text.includes('وثائق')) return BOT_REPLIES['أرشيف'];
  return BOT_REPLIES.default;
}

export function ChatBot(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, typing]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user', time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getBotReply(text),
        sender: 'bot',
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 1000);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3" dir="rtl">
      {/* Chat window */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'linear-gradient(135deg, #f96b09 0%, #0074ae 100%)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">مساعد التراث</p>
                <p className="text-white/70 text-xs">متاح الآن</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.sender === 'bot' ? 'bg-gradient-to-br from-[#f96b09] to-[#0074ae]' : 'bg-gray-300'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#f96b09] text-white rounded-tr-sm'
                        : 'bg-white text-gray-700 rounded-tl-sm shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f96b09] to-[#0074ae] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-gray-200 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #f96b09 0%, #0074ae 100%)' }}
            >
              <Send className="w-4 h-4 text-white rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #f96b09 0%, #0074ae 100%)' }}
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">اسألني</span>
          </>
        )}
      </button>
    </div>
  );
}
