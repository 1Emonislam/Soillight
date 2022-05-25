import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import DashboardHeader from './Sheard/DashboardHeader';
function Profile() {
  const navigate = useNavigate();
  const userLogin = useSelector(state => state.userLogin);
  const { user } = userLogin;
  useEffect(() => {
    if (!user?.message) {
      navigate('/login')
    }
  }, [navigate, user?.message])
  return (
    <div>
      <DashboardHeader title="Profile"/>
      <div className="profile-section">
        <Grid container spacing={2} alignContent="center">
          <Grid item xs={12}>
            <div className="profile-section-container">
              <div className="profile-view">
                <img style={{ width: '100px', height: '100px', borderRadius: '100px', border: '6px solid #F5AB24' }} src={user?.data?.pic} alt={user?.data?.name} />
              </div>
              <div>
                <span style={{ color: "#7C7C7C" }}>{user?.data?.email}</span>
                <br />
                <span style={{ color: '#3858cd' }}>{user?.data?.isAdmin === true ? 'Admin' : 'not a Admin'}</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="account-title">
              Account
            </div>
            <div className="item-info">
              <p>Username</p>
              <input value={user?.data?.name} type="text" readOnly />
            </div>
            <div className='item-info'>
              <p>Email</p>
              <input value={user?.data?.email} type="email" readOnly />
            </div>
            <div className='item-info'>
              <p>Phone Number</p>
              <input value={user?.data?.phone} type="text" readOnly />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Profile