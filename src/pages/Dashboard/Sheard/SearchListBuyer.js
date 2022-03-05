import { Grid, Pagination } from '@mui/material'
import React from 'react'
import { BsSearch } from 'react-icons/bs'
import './SearchList.css'
function SearchListBuyer({ title, data, setPage, limit, count, handleSingleUser, setSearchText, searchTitle, handleApproveRequest, handleNewRequest }) {
  const userData = [...data]
  return (
    <div className='search-container-box'>
      <h4 className='search-title' style={{ paddingLeft: '30px' }}>{title}</h4>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        {handleNewRequest && <button className='btn-search '>
          New Request
        </button>}
        {handleApproveRequest && <button className='btn-search'>
          Approved Request
        </button>}
      </div>
      <div className='searchInput-relative'>
        <input className='searchInput' onChange={(e) => setSearchText(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
        <div className="searchInput-icon">
          <BsSearch />
        </div>
        <div style={{ paddingLeft: '30px' }}>
          <p style={{ fontSize: '16px', color: '#AAAAAA' }}>{count && <> Total: {count} </>}</p>
        </div>
        {userData && userData?.map(user => (<button onClick={(e) => handleSingleUser(e, user?._id)} className="user-list" key={user?._id}>
          <Grid container spacing={0} alignItems="center" textAlign="left">
            <Grid item xs={3}>
              <>
                <img style={{ width: '50px', height: '50px', borderRadius: '50px', border: '2px solid #F5AB24' }} src={user?.pic} alt={user?.name} />
              </>
            </Grid>
            <Grid item xs={7}>
              <>
                <h5><strong>{user?.name}</strong></h5>
                <small>{user?.email}</small>
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

export default SearchListBuyer