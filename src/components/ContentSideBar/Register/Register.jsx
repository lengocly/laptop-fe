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

        try {
            const data = await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess(data?.message || 'Kiểm tra email để xác minh tài khoản.');
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 422) {
                setError(
                    data?.message ||
                    data?.errors?.email?.[0] ||
                    data?.errors?.password?.[0] ||
                    'Dữ liệu không hợp lệ.'
                );
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