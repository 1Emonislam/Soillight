import { Grid } from '@mui/material'
import React from 'react'
import { AiOutlineSetting } from 'react-icons/ai'
import { HiMenuAlt3 } from 'react-icons/hi'
import logo from '../../../images/logo/soillightLogo.png'
import './Dashboard.css'
import DashboardSetting from './DashboardSetting'
function DashboardHeader({ title }) {
    return (
        <div className='dashboard-header-color'>
            <Grid container spacing={0} alignItems="center">
                <Grid item xs={2}>
                    <div className="logo">
                        <img src={logo} style={{ width: '144px' }} alt="soillight logo" />
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div className="hi-menu">
                        <HiMenuAlt3 size={30} color="#F5AB24" />
                        <strong className='dash-title'>{title}</strong>
                    </div>
                </Grid>
                <Grid item xs={1}style={{textAlign:'right'}}>
                    <DashboardSetting>
                        <div className="dash-setting">
                            <AiOutlineSetting color="#222222" />
                        </div>
                    </DashboardSetting>
                </Grid>
            </Grid>
        </div >
    )
}

export default DashboardHeader;