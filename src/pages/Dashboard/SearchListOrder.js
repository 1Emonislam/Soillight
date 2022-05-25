import { Grid, Pagination } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import moment from 'moment'
import React, { useState } from 'react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { BsSearch } from 'react-icons/bs'
import Loading from './Sheard/Loading'
import './Sheard/SearchList.css'
function SearchListOrder({ title, setPage, data, limit, count, order, handleCancelRequest, handleSingleClick, setSearchText, searchTitle, handleOrderDeliveredRequest, handlePendingRequest }) {
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
              aria-label="wrapped label tabs example" centered
              style={{ minHeight: '40px!important', justifyContent: 'space-around' }}
              TabIndicatorProps={{
                style: {
                  display: "none",
                  minHeight: '40px!important'
                }
              }}
            >
              <Tab className="btn-search" id="btn-search" style={{ marginLeft: '10px', minHeight: '40px!important', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px' }} value="one" label="pending" onClick={(e) => handlePendingRequest()}>
              </Tab>
              {handleOrderDeliveredRequest && <Tab value="two" label="delivered" style={{ marginLeft: '10px', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px', minHeight: '42px!important' }} className="btn-search" onClick={() => handleOrderDeliveredRequest()}>
              </Tab>}
              {handleCancelRequest && <Tab value="three" label="Cancel" style={{ marginLeft: '10px', textTransform: "capitalize", padding: '0 20px', borderRadius: '40px', minHeight: '42px!important' }} className="btn-search" onClick={() => handleCancelRequest()}>
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
        {!data ? <Loading /> : dataState?.objects?.map((user, index) => (user?.user?.name && <button className={toggleActiveStyle(index)} onClick={() => handleSingleClick(user?._id, toggleActive(index))} key={user?._id}>
         <Grid container spacing={0} alignItems="center" textAlign="left">
            <Grid item xs={3}>
              <>
                <img className="img-box-list-item" style={{ borderRadius: '50px', border: '2px solid #F5AB24' }} src={user?.user?.pic} alt={user?.user?.name} />
              </>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={11}>
                  <>
                    <h5><span>Buyer:</span>
                      <b style={{ fontSize: '11px', marginRight: '3px' }}>{user?.user?.name}</b></h5>
                    <h5><span style={{ color: '#646262' }}> {
                      <>
                        {user?.user?.email}
                      </>
                    }</span></h5>
                  </>
                </Grid>
                <Grid item xs={1}>
                  <span style={{ color: "#FF0000", fontSize: '16px', fontWeight: "bold", textAlign: "right", paddingRight: '3px' }}>
                    ${
                      user?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)
                    }
                  </span>
                </Grid>
                <small style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}><AiOutlineClockCircle style={{ marginRight: '4px' }} />{moment(user?.createdAt).fromNow()}</small>
              </Grid>
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

export default SearchListOrder