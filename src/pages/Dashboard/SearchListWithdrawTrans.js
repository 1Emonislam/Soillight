import { Grid, Pagination } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import Loading from './Sheard/Loading'
import './Sheard/SearchList.css'
function SearchListWithdrawTrans({ title, setPage, data, limit, count, handleSingleClick, handlePendingRequest, handleApproveRequest, setSearchText, searchTitle, handleCancelledRequest }) {
    const [value, setValue] = React.useState('one');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [...data]
    })
    React.useEffect(() => {
        setDataState({ activeObject: dataState?.activeObject, objects: [...data] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    function toggleActive(index) {
        setDataState({ ...dataState, activeObject: dataState.objects[index] })
    }
    function toggleActiveStyle(index) {
        if (dataState.objects[index] === dataState.activeObject) {
            return 'user-list active'
        } else {
            return 'user-list inactive'
        }
    }
    return (
        <div className='search-container-box'>
            <h4 className='search-title' style={{ paddingLeft: '30px' }}>{title}</h4>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0' }}>
                {handleCancelledRequest && <>
                    <Box sx={{ width: '100%', justifyContent: 'center' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="wrapped label tabs example" centered
                            style={{ minHeight: '40px!important', justifyContent: 'space-around' }}
                            TabIndicatorProps={{
                                style: {
                                    display: "none",
                                    minHeight: '40px!important'
                                }
                            }}
                        >
                            <Tab className="btn-search" id="btn-search" style={{ marginLeft: '10px', minHeight: '40px!important', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px' }} value="one" label="pending" onClick={(e) => handlePendingRequest(e)}>
                            </Tab>
                            {handleApproveRequest && <Tab value="two" label="Approved" style={{ marginLeft: '10px', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px', minHeight: '42px!important' }} className="btn-search" onClick={() => handleApproveRequest('approved')}>
                            </Tab>}
                            {handleApproveRequest && <Tab value="three" label="Cancel" style={{ marginLeft: '10px', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px', minHeight: '42px!important' }} className="btn-search" onClick={() => handleCancelledRequest('cancel')}>
                            </Tab>}
                        </Tabs>
                    </Box>
                </>}
            </div>
            <div className='searchInput-relative'>
                <input className='searchInput' onChange={(e) => setSearchText(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                <div className="searchInput-icon">
                    <BsSearch />
                </div>
                <div style={{ paddingLeft: '30px' }}>
                    <p style={{ fontSize: '16px', color: '#AAAAAA' }}>{count && <> Total: {count} </>}</p>
                </div>
                {!data ? <Loading /> : dataState?.objects?.map((withdraw, index) => (<button className={toggleActiveStyle(index)} onClick={() => handleSingleClick(withdraw?._id, toggleActive(index))} key={withdraw?._id}>
                    <Grid container spacing={0} alignItems="center" textAlign="left">
                        <Grid item xs={3}>
                            <>
                                <img className="img-box-list-item" style={{ borderRadius: '50px', width: "43px", height: '43px', border: '2px solid #F5AB24' }} src={withdraw?.user?.pic} alt={withdraw?.user?.name} />
                            </>
                        </Grid>
                        <Grid item xs={6}>
                            <>
                                {/* {console.log(withdraw)} */}
                                <h5><span> </span>
                                    <b style={{ fontSize: '11px', marginRight: '3px' }}>{withdraw?.user?.name}</b></h5>
                                <h5 style={{ fontSize: '10px' }}>Bank: <span style={{ color: '#646262', width: '40px' }}> {withdraw?.bank_pay?.bank_acc_num || 'N/A'}</span></h5>
                                {/* {console.log(withdraw)} */}
                                <h5 style={{ fontSize: '12px' }}>Trans: <span style={{ color: '#646262', width: '40px' }}> {withdraw?.transaction_id || 'N/A'}</span></h5>
                                {/* {console.log(withdraw)} */}
                                <h5 style={{ fontSize: '12px' }}>shop: <span style={{ color: '#646262', width: '40px' }}> {withdraw?.user?.sellerShop?.name || 'N/A'}</span></h5>
                                {/* {console.log(withdraw)} */}
                            </>
                        </Grid>
                        <Grid item xs={3} textAlign="right">
                            <div>
                                <small style={{ display: 'flex', fontSize: "10px", alignItems: 'center',marginBottom:'5px'  }}>{new Date(withdraw?.createdAt)?.toLocaleTimeString()} {new Date(withdraw?.createdAt)?.toLocaleDateString()}</small>
                            </div>
                            <div>
                                <span style={{ color: "#FF0000", fontSize: '16px', fontWeight: "bold", textAlign: "right", paddingRight: '3px' }}>
                                    ${
                                        withdraw?.amount
                                    }
                                </span>
                            </div>
                        </Grid>
                    </Grid>
                </button>))}
                <Pagination
                    count={Math.ceil(count / limit)}
                    color="secondary"
                    variant="outlined"
                    onChange={(e, value) => setPage(value)}
                />
            </div>
        </div >
    )
}

export default SearchListWithdrawTrans