import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthProvider';
function AdminRoute({ children }) {
    const { loading, isAuthenticated, isAdmin } = useContext(AuthContext);
    if (loading) return null;
    if (!isAuthenticated) {
        return <Navigate to="/dang-nhap?next=/admin/don-hang" replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
}
export default AdminRoute;