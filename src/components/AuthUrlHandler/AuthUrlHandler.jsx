import { useContext, useEffect, useState } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
const ERROR_MESSAGES = {
    invalid_or_expired_link: 'Link hết hạn hoặc không hợp lệ.',
    invalid_hash: 'Link xác minh không hợp lệ.',
};
function AuthUrlHandler() {
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const verified = params.get('verified');
        const error = params.get('error');
        if (!verified && !error) {
            return;
        }
        if (verified === '1') {
            setMessage('Email đã xác minh. Hãy đăng nhập.');
        } else if (error && ERROR_MESSAGES[error]) {
            setMessage(ERROR_MESSAGES[error]);
        }
        setType('login');
        setIsOpen(true);
        params.delete('verified');
        params.delete('error');
        const remaining = params.toString();
        const nextUrl = remaining
            ? `${window.location.pathname}?${remaining}`
            : window.location.pathname;
        window.history.replaceState(null, '', nextUrl);
    }, [setIsOpen, setType]);
    useEffect(() => {
        if (!message) {
            return undefined;
        }
        const timer = setTimeout(() => setMessage(''), 8000);
        return () => clearTimeout(timer);
    }, [message]);
    if (!message) {
        return null;
    }
    return (
        <div
            style={{
                position: 'fixed',
                top: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1002,
                background: '#fff',
                padding: '12px 20px',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: 'min(90vw, 420px)',
                textAlign: 'center',
            }}
        >
            <p style={{ margin: 0 }}>{message}</p>
        </div>
    );
}
export default AuthUrlHandler;

