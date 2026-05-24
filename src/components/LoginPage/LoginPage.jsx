import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { SideBarContext } from '@/contexts/SideBarProvider';
import MyHeader from '@components/Header/Header';
import Button from '@components/Button/Button';

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

    // Tùy chọn: tự mở sidebar khi verify thành công
    useEffect(() => {
        if (verified === '1') {
            setType('login');
            setIsOpen(true);
        }
    }, [verified, setType, setIsOpen]);

    const openLoginSidebar = () => {
        setType('login');
        setIsOpen(true);
    };

    //MyHeader : Giống trang khác, vẫn có menu
    return (
        <>
            <MyHeader />
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                {message && <p style={{ marginBottom: 20 }}>{message}</p>}
                {!message && <p>Vui lòng đăng nhập.</p>}
                <Button content="Đăng nhập" onClick={openLoginSidebar} />
            </div>
        </>
    );
}

export default LoginPage;