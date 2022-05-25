import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { logOut } from "./management/actions/userActions";
import AdminProtect from "./pages/Authentication/AdminProtect";
import ChangePassword from "./pages/Authentication/ChangePassword";
import EditProfile from "./pages/Authentication/EditProfile";
import Login from "./pages/Authentication/Login";
import Buyer from "./pages/Dashboard/Buyer";
import Categories from "./pages/Dashboard/Categories";
import DashBoard from "./pages/Dashboard/DashBoard";
import Order from "./pages/Dashboard/Order";
import Product from "./pages/Dashboard/Product";
import Profile from "./pages/Dashboard/Profile";
import Rider from "./pages/Dashboard/Rider";
import Seller from "./pages/Dashboard/Seller";
import WithdrawTransaction from "./pages/Dashboard/WithdrawTransaction";
import DashboardHome from "./pages/DashBoardHome/DashboardHome";
function App() {
  const userLogin = useSelector(state => state.userLogin);
  const { user } = userLogin;
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logOut())
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/permission" element={<>
            {!user?.data?.email && <div style={{ textAlign: 'center', marginTop: '50px' }}>Deny permission! You can only access this page from the admin <Link to="/login">Login</Link></div>}
            {user?.data?.email && <>
              <p style={{ textAlign: 'center', marginTop: '50px' }}>Deny permission! You can only access this page from the admin</p><h2 onClick={handleLogOut} style={{ textAlign: 'center', cursor: 'pointer' }}>Log Out</h2> </>}
          </>}></Route>
          <Route path="/dashboard" element={<DashboardHome>
          </DashboardHome>}>
            <Route path="dashboard" element={<AdminProtect><DashBoard /> </AdminProtect>} />
            <Route path="order" element={<Order />} />
            <Route path="product" element={<Product />} />
            <Route path="withdraw/transaction" element={<WithdrawTransaction />} />
            <Route path="buyer" element={<Buyer />} />
            <Route path="seller" element={<Seller />} />
            <Route path="rider" element={<Rider />} />
            <Route path="profile" element={<Profile />} />
            <Route path="categories" element={<Categories />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route path="*" element={<h2>Not Founds 404!</h2>}></Route>
        </Routes>
      </BrowserRouter >
    </div >
  );
}

export default App;
