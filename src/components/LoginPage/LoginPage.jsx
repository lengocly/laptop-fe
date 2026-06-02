import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import HomePage from '@components/HomePage/HomePage';
function LoginPage() {
    //useSearchParams() Đọc ?verified=1, ?error=... từ URL
    const [searchParams] = useSearchParams();

    //SideBarContext Mở sidebar giống bấm "Đăng nhập" trên Header
    const { setIsOpen, setType } = useContext(SideBarContext);

    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    let message = '';
    if (verified === '1') {
        message = 'Email đã xác minh. Hãy đăng nhập.';
    } else if (error === 'invalid_or_expired_link') {
        message = 'Link hết hạn hoặc không hợp lệ.';
    } else if (error === 'invalid_hash') {
        message = 'Link xác minh không hợp lệ.';
    }

     //useEffect khi verified=1 : Tự mở form login (tiện sau khi bấm link mail) — có thể bỏ nếu chỉ muốn nút

    // Tùy chọn: tự mở sidebar 
    useEffect(() => {
        setType('login');
        setIsOpen(true);
    }, [setType, setIsOpen]);

    
    return (
        <>
            <HomePage />

            {message && (
                <div
                    style={{
                        position: 'fixed',
                        top: 120,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1002,
                        background: '#fff',
                        padding: '12px 20px',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    <p>{message}</p>
                </div>
            )}
        </>
    );
}

export default LoginPage;