import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import InputCommon from '@components/InputCommon/InputCommon';
import Button from '@components/Button/Button';
import { AuthContext } from '@/contexts/AuthProvider';
import { updatePassword } from '@/apis/authService';
import styles from './styles.module.scss';
function AccountPage() {
    const { user, loading, isAuthenticated, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/dang-nhap?next=/tai-khoan', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);
    useEffect(() => {
        if (!user) return;
        setName(user.name || '');
        setEmail(user.email || '');
    }, [user]);
    const handleUpdateProfile = async () => {
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');
        const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
        };
        if (payload.name.length < 2) {
            setProfileError('Họ tên phải có ít nhất 2 ký tự.');
            setProfileLoading(false);
            return;
        }
        try {
            const data = await updateProfile(payload);
            setProfileSuccess(data?.message || 'Cập nhật thông tin thành công.');
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 422) {
                const firstError =
                    data?.errors?.name?.[0] ||
                    data?.errors?.email?.[0] ||
                    data?.message ||
                    'Dữ liệu không hợp lệ.';
                setProfileError(firstError);
            } else {
                setProfileError('Không thể cập nhật thông tin.');
            }
        } finally {
            setProfileLoading(false);
        }
    };
    const handleChangePassword = async () => {
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');
        if (!currentPassword) {
            setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
            setPasswordLoading(false);
            return;
        }
        if (password.length < 8) {
            setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự.');
            setPasswordLoading(false);
            return;
        }
        if (password !== passwordConfirmation) {
            setPasswordError('Mật khẩu xác nhận không khớp.');
            setPasswordLoading(false);
            return;
        }
        try {
            const data = await updatePassword({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            });
            setPasswordSuccess(data?.message || 'Đổi mật khẩu thành công.');
            setCurrentPassword('');
            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 422) {
                const firstError =
                    data?.errors?.current_password?.[0] ||
                    data?.errors?.password?.[0] ||
                    data?.message ||
                    'Dữ liệu không hợp lệ.';
                setPasswordError(firstError);
            } else {
                setPasswordError('Không thể đổi mật khẩu.');
            }
        } finally {
            setPasswordLoading(false);
        }
    };
    if (loading || !isAuthenticated) return null;
    return (
        <>
            <MyHeader />
            <main className={styles.wrap}>
                <div className={styles.pageHead}>
                    <h1>Tài khoản của tôi</h1>
                    <span>Quản lý thông tin cá nhân và bảo mật</span>
                </div>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Thông tin cá nhân</h2>
                    <p className={styles.cardHint}>
                        Cập nhật họ tên và email đăng nhập của bạn.
                    </p>
                    <div className={styles.formGrid}>
                        <InputCommon
                            label="Họ tên"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name"
                            isRequired
                        />
                        <InputCommon
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            isRequired
                        />
                    </div>
                    {profileError && <p className={styles.err}>{profileError}</p>}
                    {profileSuccess && <p className={styles.success}>{profileSuccess}</p>}
                    <div className={styles.actions}>
                        <Button
                            content={profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            onClick={handleUpdateProfile}
                            disabled={profileLoading}
                        />
                    </div>
                </section>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Đổi mật khẩu</h2>
                    <p className={styles.cardHint}>
                        Mật khẩu tối thiểu 8 ký tự, có chữ và số.
                    </p>
                    <div className={styles.formGrid}>
                        <InputCommon
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            name="current_password"
                            isRequired
                        />
                        <InputCommon
                            label="Mật khẩu mới"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            isRequired
                        />
                        <InputCommon
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            name="password_confirmation"
                            isRequired
                        />
                    </div>
                    {passwordError && <p className={styles.err}>{passwordError}</p>}
                    {passwordSuccess && <p className={styles.success}>{passwordSuccess}</p>}
                    <div className={styles.actions}>
                        <Button
                            content={passwordLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                        />
                    </div>
                </section>
                <div className={styles.links}>
                    <Link to="/don-hang-cua-toi" className={styles.link}>
                        Xem đơn hàng của tôi
                    </Link>
                    <Link to="/" className={styles.link}>
                        ← Về trang chủ
                    </Link>
                </div>
            </main>
            <MyFooter />
        </>
    );
}
export default AccountPage;

