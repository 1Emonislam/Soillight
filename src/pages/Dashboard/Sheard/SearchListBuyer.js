import { Grid, Pagination } from '@mui/material'
import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import Loading from './Loading'
import './SearchList.css'
function SearchListBuyer({ title, data, setPage, limit, count, handleSingleUser, setSearchText, searchTitle, handleApproveRequest, handleNewRequest }) {
  const [dataState, setDataState] = useState({
    activeObject: null,
    objects: [...data]
  })
  React.useEffect(() => {
    setDataState({  activeObject:dataState?.activeObject, objects: [...data] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  // console.log(data)
  // console.log(dataState.objects,data)
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
        {!data? <Loading /> :dataState?.objects?.map((user, index) => (<button className={toggleActiveStyle(index)} onClick={() => handleSingleUser(user?._id,toggleActive(index))} key={user?._id}>
          <Grid container spacing={0} alignItems="center" textAlign="left">
            <Grid item xs={3}>
              <>
                <img className="img-box-list-item"style={{ borderRadius: '50px', border: '2px solid #F5AB24' }} src={user?.pic} alt={user?.name} />
              </>
            </Grid>
            <Grid item xs={8}>
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