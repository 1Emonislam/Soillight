import { Alert, Button, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import React from 'react';
import './SearchProfileView.css';

function SearchProfileView({ data = {}, handleApproved,orderCancel,orderCompelete,isOpen,setIsOpen,  handleRejected, error, order, success, totalRate = 0, buyer, seller, rider, avgRating = 0, title }) {
    // console.log(order)
    return (
        <div style={{ height: '100vh' }}>
            {data && <div className="profile-view-section" style={{ marginTop: '70px',}}>
                {!order && <Grid container spacing={0} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="profile-view" style={{ padding: '0px 10px' }}>
                                <img style={{ width: '100px', height: '100px', borderRadius: '100px', border: '6px solid #F5AB24' }} src={data?.pic} alt={data?.name} />
                                {buyer && <div className="rating" style={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating name="read-only" value={avgRating} readOnly /><p style={{ color: "#7B7979" }}>{avgRating}({totalRate})</p>
                                </div>}
                            </div>
                        </div>
                    </Grid>
                </Grid>}
                <Grid container spacing={2} alignItems="center" justifyContent="center" className="all-center">
                    <Grid item xs={12}>
                        <div>
                            <p style={{ marginBottom: "0", marginTop: '60px' }}><strong style={{ fontWeight: '500', fontSize: '20px' }}>{title}</strong></p>
                        </div>
                    </Grid>

                    {buyer && <><Grid item xs={12} md={6}>
                        <div className="item-view">
                            <p style={{ margin: "0px", color: '#444444' }}> Name</p>
                            <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.name || 'N/A'}</p>
                        </div>
                    </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="item-view">
                                <p style={{ margin: "0px", color: '#444444' }}>Phone Number</p>
                                <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.phone || 'N/A'}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="item-view">
                                <p style={{ margin: "0px", color: '#444444' }}>Address</p>
                                <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.address || 'N/A'}
                                </p>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="item-view">
                                <p style={{ margin: "0px", color: '#444444' }}>Email</p>
                                <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.email || 'N/A'} </p>
                            </div>
                        </Grid>
                    </>}
                    {
                        rider &&
                        <>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}> Name</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.name || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Phone Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.phone || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Address</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.address || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Email</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.email || 'N/A'} </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Valid ID Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.valid_id?.id || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>License Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.license_card?.id || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Rider Status</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.status}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* <div className="item-view" style={{ padding: '0px 10px' }}>
                                    {data?.status === 'approved' ? <Button variant="contained" onClick={() => handleRejected(data?._id)} style={{ textTransform: 'capitalize', background: 'red', padding: '10px 50px', borderRadius: '8px' }}>Rejected </Button> : <Button variant="contained" onClick={() => handleApproved(data?._id)} style={{ textTransform: 'capitalize', background: '#05AC54', padding: '10px 50px', borderRadius: '8px' }}>Approved </Button>}
                                </div> */}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ borderLeft: '0px', padding: '0px 10px', marginTop: '30px', marginLeft: '85px', marginBottom: '80px' }}>
                                    {data?.status === 'approved' ? <Button variant="contained" onClick={() => handleRejected(data?._id)} style={{ textTransform: 'capitalize', background: 'red', padding: '10px 50px', borderRadius: '8px' }}>Rejected </Button> : <Button variant="contained" onClick={() => handleApproved(data?._id)} style={{ textTransform: 'capitalize', background: '#05AC54', padding: '10px 50px', borderRadius: '8px' }}>Approved </Button>}
                                </div>
                            </Grid>
                        </>
                    }
                    <>
                        {seller && <>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}> Name</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.name || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Phone Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.phone || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Address</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.address || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Email</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.email || 'N/A'} </p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div>
                                    <p style={{ marginBottom: "0", marginTop: '60px' }}><strong style={{ fontWeight: '500', fontSize: '20px' }}>Shop Info</strong></p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Name</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.sellerShop?.name || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Address</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.sellerShop?.address || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Phone Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.sellerShop?.phone || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Status</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.sellerShop?.status || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            {seller && data?.sellerShop?.closeDate && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Open Date</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}> {new Date(data?.sellerShop?.openDate)?.toDateString()} || N/A</p>
                                </div>
                            </Grid>}
                            {seller && data?.sellerShop?.closeDate && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Close Date</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{new Date(data?.sellerShop?.closeDate)?.toDateString() || 'N/A'}</p>
                                </div>

                            </Grid>}
                            {data?.sellerShop?.createdAt && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Created At</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}> {new Date(data?.sellerShop?.createdAt)?.toDateString() || 'N/A'}</p>
                                </div>
                            </Grid>}
                            {data?.sellerShop?.updatedAt && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Shop Updated At</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{new Date(data?.sellerShop?.updatedAt)?.toDateString() || 'N/A'}</p>
                                </div>
                            </Grid>}
                            {rider && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Seller Status</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.status}</p>
                                </div>
                            </Grid>}
                            {rider && <Grid item xs={12} md={6} >
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                </div>
                            </Grid>
                            }
                            {seller && <Grid item xs={12} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <p style={{ margin: "0px", color: '#444444' }}>Seller Status</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.status}</p>
                                </div>
                            </Grid>}
                            {error && <Grid item xs={12} >
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <Alert severity="error" timeout={5000} md={6}>{error}</Alert>
                                </div>
                            </Grid>}
                            {success && <Grid item xs={12} timeout={5000} md={6}>
                                <div className="item-view" style={{ padding: '0px 10px' }}>
                                    <Alert severity="success" timeout={5000} md={6}> {success}</Alert>
                                </div>
                            </Grid>}
                            {seller && <Grid item xs={12} md={6} style={{}}>
                            </Grid>}
                            <Grid item xs={12} md={6} style={{ marginBottom: '50px', marginTop: '20px', marginLeft: '85px' }}>
                                <div className="item-view" style={{ padding: '0px 10px', borderLeft: '0px' }}>
                                    {data?.status === 'approved' ? <Button variant="contained" onClick={() => handleRejected(data?._id)} style={{ textTransform: 'capitalize', background: 'red', padding: '10px 50px', borderRadius: '8px' }}>Rejected </Button> : <Button variant="contained" onClick={() => handleApproved(data?._id)} style={{ textTransform: 'capitalize', background: '#05AC54', padding: '10px 50px', borderRadius: '8px' }}>Approved </Button>}
                                </div>
                            </Grid>
                        </>
                        }
                        {order && <>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}> Order Time</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{new Date(data?.createdAt)?.toLocaleString('en-us', { weekday: 'long', month: 'long', year: 'numeric', day: 'numeric', time: 'numeric', hour: 'numeric', minute: 'numeric' }) || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Order Number</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?._id || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Buyer Name</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.user?.name || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Buyer Address</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.user?.address || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Rider Name</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Rider Address</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Transaction ID:</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.transaction_id || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Tax Ref:</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.tx_ref || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <p style={{ margin: "0px", color: '#444444' }}>Order Status:</p>
                                    <p style={{ margin: "0px", color: "#2B2C43" }}>{data?.status || 'N/A'}
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className="item-view">
                                    <span style={{ margin: "0px", color: '#444444' }}>Total: </span>
                                    <span style={{ color: 'black', fontWeight: '500' }}> ${data?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)}</span>
                                </div>
                            </Grid>
                            <>
                                {data?.products?.map((pd, index) => (<Grid key={index} container spacing={0} alignItems="center"justifyContent="center" style={{ paddingTop: '40px' }}>
                                    <Grid item xs={3} md={2}lg={2}>
                                        <div>
                                            <span>
                                                <img style={{ width: '100px', height: '100px', borderRadius: "10px", marginRight: '6px' }} src={pd?.productId?.img} alt={pd?.productId?.name} />
                                            </span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={10} md={10}lg={10} style={{ marginBottom: '5px' }}>
                                        <Grid container spacing={0} alignItems="center" justifyContent="center" style={{ borderBottom: '1px solid #ddd', paddingBottom: "5px",width:'90%' }}>
                                            <Grid item xs={6} md={6}>
                                                <div>
                                                    <div>
                                                        <span>
                                                            {pd?.productId?.name}
                                                            <br />
                                                            <span style={{ fontSize: '14px', color: 'gray', marginRight: '5px' }}>
                                                                seller:
                                                            </span>
                                                            <span style={{ fontSize: '14px' }}>
                                                                {pd?.productOwner?.name}
                                                            </span>
                                                        </span>
                                                        <br />
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Rating name="read-only" style={{ fontSize: '14px', marginRight: '4px' }} value={pd?.productId?.rating || 0} readOnly />
                                                            <span style={{ fontSize: "15px" }}>{pd?.productId?.rating|| 0} </span>
                                                            <span style={{ fontSize: '10px', color: 'gray', marginLeft: '2px' }}> ({pd?.productId?.numReviews})</span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '12px', color: 'gray', marginRight: '4px' }}>Shop Addr:</span>
                                                            <span style={{ fontSize: '10px' }} key={index}>{pd?.productOwner?.sellerShop?.address}</span>
                                                        </div>
                                                    </div>
                                                </div></Grid>
                                            <Grid item xs={4} md={2}>
                                                <div>
                                                    <span style={{ fontSize: '10px' }}><span style={{ color: 'gray' }}> Quantity: </span> {pd?.quantity}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '10px' }}> <span style={{ color: 'gray' }}>Pack Type:</span> {pd?.productId?.pack_type}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '10px' }}> <span style={{ color: 'gray' }}>Serving Size:</span> {pd?.productId?.serving_size}</span>
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} md={2}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ color: 'gray', fontSize: '14px' }}>
                                                        Price:
                                                    </span>
                                                    <br />
                                                    <span style={{ fontSize: '18px', color: '#FF0000' }}>
                                                        {pd?.price}
                                                    </span>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>))
                                }
                                <Grid container spacing={0}>
                                    <Grid item xs={11} style={{ textAlign: 'right', paddingRight: "40px", paddingTop: '10px' }}>
                                        <span style={{ color: 'black', fontWeight: '500' }}> Total: ${data?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)}</span>
                                    </Grid>
                                </Grid>
                            </>
                            {<Grid item xs={12} md={6} style={{}}>
                            </Grid>}
                            <Grid item xs={12} md={6} style={{ marginBottom: '50px', marginTop: '20px', marginLeft: '85px' }}>
                                <div className="item-view" style={{ padding: '0px 10px', borderLeft: '0px' }}>
                                    {data?.status === 'complete' ? <Button disabled={isOpen}variant="contained" onClick={() => orderCancel(data?._id)} style={{ textTransform: 'capitalize', background: 'red', padding: '10px 50px', borderRadius: '8px' }}>Order Cancel</Button> : <Button variant="contained"disabled={isOpen} onClick={() => orderCompelete(data?._id)} style={{ textTransform: 'capitalize', background: '#05AC54', padding: '10px 50px', borderRadius: '8px' }}> Order Complete </Button>}
                                </div>
                                {/* {console.log(isOpen)} */}
                                {success&&  <Alert severity="success" timeout={5000} md={6}>{success}</Alert>}
                                {error&&  <Alert severity="error" timeout={5000} md={6}>{error}</Alert>}
                            </Grid>
                        </>}
                    </>
                </Grid >
            </div >}
        </div >
    )
}

export default SearchProfileView