import { Navigate, useSearchParams } from 'react-router-dom';
function LoginPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.toString();
    return <Navigate to={query ? `/?${query}` : '/'} replace />;
}
export default LoginPage;

