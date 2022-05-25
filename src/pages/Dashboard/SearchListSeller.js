import { Grid, Pagination } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import moment from 'moment';
import React, { useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import Loading from './Sheard/Loading';
import './Sheard/SearchList.css';
function SearchListSeller({ title, data, setPage, limit, count, seller, handleSingleUser, setSearchText, searchTitle, handleApproveRequest, handlePendingRequest }) {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        {handlePendingRequest && <>
          <Box sx={{ width: '100%', justifyContent: 'center' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"  centered
              TabIndicatorProps={{
                style: {
                  display: "none",
                  justifyContent:'center!important'
                }
              }}
            >
              <Tab className="btn-search" style={{ marginLeft: '10px', minHeight: '42px', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px' }} value="one" label="Pending Request" onClick={(e) => handlePendingRequest(e, 'latest')}>
              </Tab>
              {handleApproveRequest && <Tab value="two" label="Approved Request" style={{ marginLeft: '10px', textTransform: "capitalize", padding: '0 20px', minHeight: '42px', borderRadius: '40px' }} className="btn-search" onClick={() => handleApproveRequest()}>
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
        {!data? <Loading /> : dataState?.objects?.map((user,index) => (<button className={toggleActiveStyle(index)} onClick={() => handleSingleUser(user?._id, toggleActive(index))} key={user?._id}>
          <Grid container spacing={0} alignItems="center" textAlign="left">
            <Grid item xs={3}>
              <>
                <img className="img-box-list-item"style={{ borderRadius: '50px', border: '2px solid #F5AB24' }} src={user?.pic} alt={user?.name} />
              </>
            </Grid>
            <Grid item xs={8}>
              <>
                <Box sx={{ width: '100%', justifyContent: 'center' }}>

                </Box>
                <h5><span>Seller: </span>
                  <b style={{ fontSize: '11px', marginRight: '3px' }}> {user?.name}</b></h5>
                <h5>Seller Shop: <span style={{ color: '#646262' }}> {user?.sellerShop?.name || 'N/A'}</span></h5>
                <small style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}><AiOutlineClockCircle style={{ marginRight: '4px' }} />{moment(user?.createdAt).fromNow()} </small>
              </>
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

export default SearchListSeller