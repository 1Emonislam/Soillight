import { Grid } from '@mui/material'
import React from 'react'
import './DashboardTable.css'
function DashboardTableLastWeek({ date = 0, dateTitle = 0, lastWeek = 0 }) {
    return (
        <div className='table-data-container'style={{paddingBottom:'60px'}}>
            <div>
                <div className="sub-title">
                    <span style={{fontSize:'20px',fontWeight:'500'}}> {dateTitle}</span>
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
                        <span > {lastWeek?.lastWeekOrderCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Buyer</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > {lastWeek?.lastWeekBuyerCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > { lastWeek?.lastWeekRiderCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Total Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > { lastWeek?.lastWeekSellerCount}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Delivered Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {lastWeek?.lastWeekOrderDelivered}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Pending Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {lastWeek?.lastWeekOrderPending}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Cancel Order</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {lastWeek?.lastWeekOrderCancel}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Approved Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span> {lastWeek?.lastWeekSellerApprove}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span> Approved Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span > { lastWeek?.lastWeekRiderApprove}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span>Rejected Buyer</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span>{lastWeek?.lastWeekBuyerRejected}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span >Rejected Seller</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span >{ lastWeek?.lastWeakSellerRejected}</span>
                    </Grid>
                    <Grid item xs={8} className="list">
                        <span >Rejected Rider</span>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }} className="list">
                        <span >{lastWeek?.lastWeekRiderRejected}</span>
                    </Grid>
                </Grid>
            </>

        </div>
    )
}

export default DashboardTableLastWeek