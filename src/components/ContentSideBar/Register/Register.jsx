import InputCommon from '@components/InputCommon/InputCommon';
import styles from '../Login/styles.module.scss';
import Button from '@components/Button/Button';
import { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import { SideBarContext } from '@/contexts/SideBarProvider';
function Register() {
    const { container, title } = styles;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const { setType } = useContext(SideBarContext);
    const handleRegister = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            password_confirmation: passwordConfirmation,
        };
        if (payload.name.length < 2) {
            setError('Họ tên phải có ít nhất 2 ký tự.');
            setLoading(false);
            return;
        }
        if (payload.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            setLoading(false);
            return;
        }
        if (payload.password !== payload.password_confirmation) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }
        try {
            const data = await register(payload);
            setSuccess(data?.message || 'Kiểm tra email để xác minh tài khoản.');
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 422) {
                const firstError =
                    data?.errors?.name?.[0] ||
                    data?.errors?.email?.[0] ||
                    data?.errors?.password?.[0] ||
                    data?.message ||
                    'Dữ liệu không hợp lệ.';
                setError(firstError);
            } else {
                setError('Đăng ký thất bại.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={container}>
            <div className={title}>SIGN UP</div>
            <InputCommon label="Name" type="text" value={name}
                onChange={(e) => setName(e.target.value)} name="name" isRequired />
            <InputCommon label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} name="email" isRequired />
            <InputCommon label="Password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} name="password" isRequired />
            <InputCommon label="Confirm password" type="password" value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)} name="password_confirmation" isRequired />
            <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>
                Mật khẩu tối thiểu 8 ký tự, có chữ và số.
            </p>
            {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}
            {success && <p style={{ color: 'green', fontSize: 14 }}>{success}</p>}
            <Button
                content={loading ? 'Đang đăng ký...' : 'REGISTER'}
                onClick={handleRegister}
                disabled={loading}
            />
            <p style={{ marginTop: 20, textAlign: 'center', cursor: 'pointer', fontSize: 14 }}
                onClick={() => setType('login')}>
                Đã có tài khoản? Đăng nhập
            </p>
        </div>
    );
}
export default Register;