import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { sendChatMessage } from '@/apis/chatService';
import { Link } from 'react-router-dom';
import { FiSend, FiX, FiMessageCircle } from 'react-icons/fi';

function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: 'Chào anh/chị! Em là trợ lý mua sắm AI của BetaTech. Anh/chị cần tư vấn gì ạ?',
            suggestions: [
                'Tìm laptop gaming',
                'Laptop đi học',
                'Cách đặt hàng',
                'Chính sách đổi trả',
            ],
        },
    ]);

    const sendingRef = useRef(false);
    const isMountedRef = useRef(true);

    // Tránh setState sau khi component unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSend = async (textOverride) => {
        const text = (textOverride ?? input).trim();
        if (!text || loading || sendingRef.current) return;

        sendingRef.current = true;

        const nextMessages = [...messages, { role: 'user', text }];
        setMessages(nextMessages);
        setInput('');
        setLoading(true);

        try {
            const apiMessages = nextMessages
                .filter(
                    (msg, index) =>
                        !(index === 0 && msg.role === 'model') &&
                        !msg.text?.includes('Hệ thống đang bận') &&
                        !msg.text?.includes('gửi quá nhanh')
                )
                .slice(-10);

            const { reply, suggestions, products } = await sendChatMessage(apiMessages);

            if (!isMountedRef.current) return;

            setMessages([
                ...nextMessages,
                { role: 'model', text: reply, suggestions, products },
            ]);
        } catch (err) {
            if (!isMountedRef.current) return;

            const isRateLimit = err?.response?.status === 429;
            setMessages([
                ...nextMessages,
                {
                    role: 'model',
                    text: isRateLimit
                        ? 'Anh/chị gửi tin hơi nhanh, vui lòng đợi 1 phút rồi thử lại ạ.'
                        : 'Hệ thống đang bận, anh/chị thử lại sau nhé.',
                },
            ]);
        } finally {
            if (isMountedRef.current) {
                sendingRef.current = false;
                setLoading(false);
            }
        }
    };

    const sendSuggestion = (text) => {
        handleSend(text);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.wrapper}>
            {!open && (
                <button
                    type="button"
                    className={styles.fab}
                    onClick={() => setOpen(true)}
                    aria-label="Mở chat"
                >
                    <FiMessageCircle size={26} />
                </button>
            )}

            {open && (
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <div className={styles.headerIcon}>
                                <FiMessageCircle size={18} />
                            </div>
                            <div>
                                <h3 className={styles.headerTitle}>Trợ Lý Mua Sắm AI</h3>
                                <div className={styles.badges}>
                                    <span className={styles.badge}>
                                        <i className={styles.dot} /> Gemini AI
                                    </span>
                                    <span className={styles.badge}>
                                        <i className={styles.dot} /> Smart Mode
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setOpen(false)}
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className={styles.body}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.role === 'user'
                                        ? styles.messageRowUser
                                        : styles.messageRowBot
                                }
                            >
                                {msg.role === 'model' && (
                                    <div className={styles.avatar}>AI</div>
                                )}

                                <div className={styles.messageContent}>
                                    <div
                                        className={
                                            msg.role === 'user'
                                                ? styles.userBubble
                                                : styles.botBubble
                                        }
                                    >
                                        {msg.text}
                                    </div>

                                    {msg.role === 'model' && msg.suggestions?.length > 0 && (
                                        <div className={styles.suggestionGrid}>
                                            {msg.suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className={styles.suggestionChip}
                                                    onClick={() => sendSuggestion(s)}
                                                    disabled={loading}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {msg.role === 'model' && msg.products?.length > 0 && (
                                        <div className={styles.productList}>
                                            {msg.products.map((p) => (
                                                <Link
                                                    key={p.id}
                                                    to={`/product/${p.id}`}
                                                    className={styles.productCard}
                                                >
                                                    <img src={p.image} alt={p.name} />
                                                    <div className={styles.productInfo}>
                                                        <p className={styles.productName}>{p.name}</p>
                                                        <p className={styles.productPrice}>{p.price}</p>
                                                        <span className={styles.inStock}>Còn hàng</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className={styles.messageRowBot}>
                                <div className={styles.avatar}>AI</div>
                                <div className={styles.botBubble}>
                                    <span className={styles.typing}>Đang trả lời...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.inputWrap}>
                            <input
                                type="text"
                                placeholder="Bạn cần hỗ trợ gì không?"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.sendBtn}
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                            >
                                <FiSend size={16} />
                            </button>
                        </div>
                        <p className={styles.poweredBy}>Powered by BetaTech AI</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatWidget;
