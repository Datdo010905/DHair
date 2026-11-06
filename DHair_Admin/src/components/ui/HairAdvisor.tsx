import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUp, FiEdit3, FiMessageCircle, FiScissors, FiStar } from 'react-icons/fi';
import AdminIcon from './AdminIcon';
import '../../assets/css/hair-advisor.css';

type Message = { id: number; role: 'assistant' | 'user'; text: string };
const welcome: Message = {
  id: 0,
  role: 'assistant',
  text: 'Chào bạn! Mình là trợ lý kiểu tóc DHair. Bạn muốn thay đổi diện mạo hay tìm một kiểu tóc dễ chăm sóc? Hãy chia sẻ ý tưởng của bạn nhé.',
};
const prompts = [
  'Kiểu tóc hợp khuôn mặt tròn',
  'Tóc mỏng nên chọn kiểu nào?',
  'Mình thích tóc ngắn, dễ chăm sóc',
];
const hairstyles = [
  {
    name: 'Layer tự nhiên',
    tag: 'Nhẹ nhàng',
    description: 'Các lớp tóc mềm, tạo chuyển động tự nhiên.',
  },
  { name: 'Bob ngang cằm', tag: 'Gọn gàng', description: 'Đường cắt gọn cho một diện mạo mới.' },
  { name: 'Side part', tag: 'Thanh lịch', description: 'Ngôi tóc rõ nét, linh hoạt khi tạo kiểu.' },
];

export default function HairAdvisor() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(1);
  const conversationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#hair-advisor') {
      document.getElementById('hair-advisor')?.scrollIntoView({ block: 'start' });
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [location]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages]);

  function sendMessage(text: string) {
    const content = text.trim();
    if (!content) return;
    const userId = nextId.current++;
    const assistantId = nextId.current++;
    // Chỉ mô phỏng hội thoại để xem giao diện, không gửi dữ liệu đến API.
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: content },
      {
        id: assistantId,
        role: 'assistant',
        text: 'Đây là phản hồi mẫu để bạn trải nghiệm giao diện. Khi AI được kết nối, mình sẽ tư vấn dựa trên thông tin bạn chia sẻ. Bạn có thể xem các kiểu tóc minh họa ở mục cảm hứng nhé.',
      },
    ]);
    setDraft('');
    inputRef.current?.focus({ preventScroll: true });
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  function resetConversation() {
    setMessages([welcome]);
    setDraft('');
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <section id="hair-advisor" className="dh-advisor" aria-labelledby="hair-advisor-title">
      <div className="dh-advisor-intro">
        <div>
          <span className="dh-advisor-eyebrow">DHAIR AI · TRỢ LÝ KIỂU TÓC</span>
          <h2 id="hair-advisor-title">Một cuộc trò chuyện. Một diện mạo mới.</h2>
          <p>Khám phá kiểu tóc bạn yêu thích, bắt đầu từ chính phong cách của bạn.</p>
        </div>
        <span className="dh-advisor-preview">Bản xem trước giao diện</span>
      </div>
      <div className="dh-advisor-layout">
        <div className="dh-advisor-chat">
          <div className="dh-advisor-header">
            <span className="dh-advisor-avatar">
              <AdminIcon icon={FiStar} aria-hidden="true" />
            </span>
            <div>
              <h3>DHair AI</h3>
              <p>Không gian tư vấn kiểu tóc của bạn</p>
            </div>
            <button
              type="button"
              className="dh-advisor-reset"
              onClick={resetConversation}
              aria-label="Bắt đầu hội thoại mới"
              title="Hội thoại mới"
            >
              <AdminIcon icon={FiEdit3} aria-hidden="true" />
            </button>
          </div>
          <div className="dh-advisor-notice">Hội thoại mẫu · Chưa kết nối AI</div>
          <div
            ref={conversationRef}
            className="dh-advisor-conversation"
            role="log"
            aria-label="Hội thoại tư vấn mẫu"
            aria-live="polite"
            tabIndex={0}
          >
            <div className="dh-advisor-welcome">
              <AdminIcon icon={FiMessageCircle} aria-hidden="true" />
              <h3>Tìm kiểu tóc của riêng bạn</h3>
              <p>Một chút cảm hứng cho lần ghé salon tiếp theo.</p>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`dh-advisor-message dh-advisor-message--${message.role}`}
              >
                <span>{message.role === 'user' ? 'Bạn' : 'DHair AI · Mẫu'}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="dh-advisor-prompts">
                <span>BẠN CÓ THỂ BẮT ĐẦU VỚI</span>
                {prompts.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                    {prompt}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <form className="dh-advisor-composer" onSubmit={submitMessage}>
            <div>
              <textarea
                ref={inputRef}
                aria-label="Tin nhắn tư vấn kiểu tóc"
                placeholder="Bạn muốn kiểu tóc như thế nào?"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={2}
                maxLength={1000}
              />
              <button type="submit" disabled={!draft.trim()} aria-label="Gửi tin nhắn mẫu">
                <AdminIcon icon={FiArrowUp} aria-hidden="true" />
              </button>
            </div>
            <p>Hội thoại mẫu chỉ hiển thị trong phiên xem này.</p>
          </form>
        </div>
        <aside className="dh-advisor-inspiration" aria-label="Kiểu tóc tham khảo">
          <span className="dh-advisor-eyebrow">GÓC CẢM HỨNG</span>
          <h3>Bạn muốn thử điều gì mới?</h3>
          <p>Những gợi ý minh họa để bắt đầu. Chưa phải tư vấn cá nhân hóa.</p>
          {hairstyles.map((hairstyle, index) => (
            <article className="dh-advisor-style" key={hairstyle.name}>
              <div className="dh-advisor-style-icon">
                <AdminIcon icon={FiScissors} aria-hidden="true" />
                <span>0{index + 1}</span>
              </div>
              <div>
                <span className="dh-advisor-tag">{hairstyle.tag}</span>
                <h4>{hairstyle.name}</h4>
                <p>{hairstyle.description}</p>
              </div>
            </article>
          ))}
          <div className="dh-advisor-booking">
            <h4>Sẵn sàng cho mái tóc mới?</h4>
            <p>Trao đổi thêm với stylist khi đến salon để chọn kiểu tóc phù hợp.</p>
            <Link to="/datlich">
              Đặt lịch với stylist <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
