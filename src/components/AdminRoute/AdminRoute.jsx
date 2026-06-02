import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthProvider';

function AdminRoute({ children }) {
    const { loading, isAuthenticated, isAdmin } = useContext(AuthContext);

    if (loading) return null; //Đợi app kiểm tra đăng nhập xong.

    //Chưa đăng nhập thì chuyển về login
    if (!isAuthenticated) {
        return <Navigate to="/dang-nhap?next=/admin/don-hang" replace />;
    }

    //Không phải admin thì chuyển về trang chủ
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children; //Là admin thì cho vào trang admin
}

export default AdminRoute;