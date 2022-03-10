import { Grid } from '@mui/material'
import React from 'react'
import './DashboardTable.css'
function DashboardTableToday({ date = 0, dateTitle = 0, today=0}) {
    return (
        <div className='table-data-container'>
            <div>
                <div className="sub-title">
                    <span> {dateTitle}</span>
                    <br />
                    <small>{date}</small>
                </div>
            </div>
            <>
                <Grid container spacing={2} style={{ marginTop: '10px' }} justifyContent="center">
                    <Grid item xs={8} className="list">
                        <span>Total Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {today?.todayOrderCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Buyer</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {today?.todayBuyerCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {today?.todayRiderCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {today?.todaySellerCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Complete Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {today?.todayOrderApprove}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Pending Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span>{today?.todayOrderRejected}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Approved Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {today?.todaySellerApprove}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Approved Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {today?.todayRiderApprove}</span>
                    </Grid>
                  
                    <Grid item xs={8} className="list">
                        <span>Rejected Buyer</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span>{today?.todayBuyerRejected}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span >Rejected Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span >{today?.todaySellerRejected}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span >Rejected Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span >{today?.todayRiderRejected}</span>
                    </Grid>
                </Grid>
            </>

        </div>
    )
}

export default DashboardTableToday