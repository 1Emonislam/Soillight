import { Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { AiFillDashboard } from 'react-icons/ai'
import { BiStoreAlt } from 'react-icons/bi'
import { FaCaravan, FaUserAstronaut } from 'react-icons/fa'
import { MdPointOfSale} from 'react-icons/md'
import { useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './DashboardHome.css'
function DashboardHome() {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    return (
        <>
            <div className="dashboard-section">
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={2.3}>
                        <>
                            <div className="dashboard-admin">
                                <div className="profile-box">
                                    <img alt={user?.data?.name} src={user?.data?.pic} />
                                    <Typography variant="h6" className="text-p" gutterBottom component="div">
                                        {user?.data?.name}
                                    </Typography>
                                    <Typography variant="h6" className="role" gutterBottom component="div">
                                        {user?.data?.isAdmin === true ? 'Admin' : "Not a Admin"}
                                    </Typography>
                                </div>
                                <NavLink to="/dashboard/dashboard" className={(state) => state?.isActive ? 'selected' : ''}><AiFillDashboard /><span>Dashboard</span></NavLink>
                                <NavLink to="/dashboard/order" className={(state) => state?.isActive ? 'selected' : ''}><MdPointOfSale /><span>Order</span></NavLink>
                                <NavLink to="/dashboard/buyer" className={(state) => state?.isActive ? 'selected' : ''}><FaUserAstronaut /><span>Buyer</span></NavLink>
                                <NavLink to="/dashboard/seller" className={(state) => state?.isActive ? 'selected' : ''}><BiStoreAlt /> <span>Seller</span></NavLink>
                                <NavLink to="/dashboard/rider" className={(state) => state?.isActive ? 'selected' : ''}><FaCaravan /> <span>Rider</span></NavLink>
                                <NavLink to="/dashboard/profile" className={(state) => state?.isActive ? 'selected' : ''}><FaUserAstronaut /><span>Profile</span> </NavLink>
                            </div>
                        </>
                    </Grid>
                    <Grid item xs={12} sm={9.3}>
                        <div className="dashboard-body">
                            <Outlet />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default DashboardHome