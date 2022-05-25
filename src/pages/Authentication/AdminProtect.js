
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
function AdminProtect({ children }) {
    // console.log(children)
    const location = useLocation();
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    if (user?.data?.isAdmin=== true) {
        return children;
    }
    return <Navigate to="/permission" state={{ from: location }} />
}

export default AdminProtect