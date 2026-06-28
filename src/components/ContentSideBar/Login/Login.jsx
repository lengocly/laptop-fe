import InputCommon from '@components/InputCommon/InputCommon';
import styles from './styles.module.scss';
import Button from '@components/Button/Button';
import { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
function Login() {
    const { container, title, boxRememberMe, lostPw } = styles;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const { setIsOpen , setType } = useContext(SideBarContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const handleLogin = async () => {
        setLoading(true);
        setError('');
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setError('Vui lòng nhập email.');
            setLoading(false);
            return;
        }
        try {
            await login(normalizedEmail, password);
            setIsOpen(false);
            const next = searchParams.get('next');
            const safeNext =
                next && next.startsWith('/') && !next.startsWith('//')
                    ? next
                    : '/';
            navigate(safeNext, { replace: true });
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;
            if (status === 403) {
                setError('Vui lòng xác thực email trước khi đăng nhập.');
            } else if (status === 422) {
                setError(
                    data?.message ||
                    data?.errors?.email?.[0] ||
                    'Email hoặc mật khẩu không đúng.'
                );
            } else {
                setError('Đăng nhập thất bại.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={container}>
            <div className={title}>SIGN IN</div>
            <InputCommon
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                isRequired
            />
            <InputCommon
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                isRequired
            />
            {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}
            <div className={boxRememberMe}>
                <input type='checkbox' />
                <span>Remember me</span>
            </div>
            <Button
                content={loading ? 'Đang đăng nhập...' : 'LOGIN'}
                onClick={handleLogin}
                disabled={loading}
            />
            <p style={{ marginTop: 16, textAlign: 'center', cursor: 'pointer', fontSize: 14 }}
                onClick={() => setType('register')}>
                Chưa có tài khoản? Đăng ký
            </p>
            <div className={lostPw}>Lost your password?</div>
        </div>
    );
}
export default Login;

