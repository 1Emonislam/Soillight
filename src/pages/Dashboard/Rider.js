import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListRider from './SearchListRider'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function Rider() {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    const [chkValue, setChkValue] = useState(false);
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    const handleNewRequest = async (e) => {
        setChkValue(!chkValue)
        if (chkValue === true) {
            e.target.style.background = '#3858cd';
            e.target.style.color = 'white';
        } else {
            e.target.style.background = 'white';
            e.target.style.color = '#222';
        }
        try {
            await fetch(`https://soilight.herokuapp.com/dashboard/users/rider/lists/new`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${user?.token}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    if (data?.data) {
                        // console.log(data)
                        setSellerList(data?.data)
                        setCount(data?.count)
                    }
                })
        }
        catch {

        }

    }
    const handleApproveRequest = async (e) => {
        setChkValue(!chkValue)
        // console.log(chkValue)
        if (chkValue === true) {
            e.target.style.background = '#3858cd';
            e.target.style.color = 'white';
        } else {
            e.target.style.background = 'white';
            e.target.style.color = '#222';
        }
        try {
            await fetch(`https://soilight.herokuapp.com/dashboard/users/rider/lists/approved`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${user?.token}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    if (data?.data) {
                        // console.log(data)
                        setSellerList(data?.data)
                        setCount(data?.count)
                    }
                })

        }
        catch {
        }
    }
    const [searchText, setSearchText] = useState("")
    const [singleUser, setSingleUser] = useState("");
    const [sellerList, setSellerList] = useState([])
    const [count, setCount] = useState("")
    const [avgRating, setAvgRating] = useState("")
    const [totalRate, setTotalRate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1);
    const limit = 50;
    useEffect(() => {
        // console.log(page)
        // https://soilight.herokuapp.com/dashboard/users/rider/lists?search=${search}page=${page}&&limit=${limit}
        let search = searchText || '';
        fetch(`https://soilight.herokuapp.com/dashboard/users/rider/lists?search=${search}&&page=${page}&&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data?.data) {
                    setSellerList(data?.data)
                    setCount(data?.count)
                }
            })
    }, [page, searchText, user?.token]);
    const handleSingleUser = (e,id) => {
        // console.log(id)
        // console.log(id)
        fetch(`https://soilight.herokuapp.com/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setTotalRate(data?.totalRate)
                setAvgRating(data.avgRating)
                setSingleUser(data?.data)
            })
    }
    const handleApproved = (id) => {
        // console.log(id)
        fetch(`https://soilight.herokuapp.com/users/approved/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.error) {
                    setOpen(true)
                    setSuccess("")
                    setError(data?.error)
                }
                if (data?.data) {
                    setOpen(true)
                    setError("")
                    setSuccess(data?.message)
                    setTotalRate(data?.totalRate)
                    setAvgRating(data.avgRating)
                    setSingleUser(data?.data)
                }

            })
    }
    const handleRejected = (id) => {
        fetch(`https://soilight.herokuapp.com/users/rejected/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.error) {
                    setSuccess("")
                    setError(data?.error)
                    setOpen(true)
                }
                if (data?.data) {
                    setError("")
                    setSuccess(data?.message)
                    setTotalRate(data?.totalRate)
                    setAvgRating(data.avgRating)
                    setSingleUser(data?.data)
                    setOpen(true)
                }
            })
    }
    useEffect(
        () => {
            let timer1 = setTimeout(() => setOpen(true), 5 * 1000)
            return () => {
                clearTimeout(timer1);
            };
        }, [open]);
    return (
        <div>
            <DashboardHeader title="Rider" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={4}>
                    <SearchListRider handleSingleUser={handleSingleUser} count={count} data={sellerList} setSearchText={setSearchText} title=""setPage={setPage}limit={limit} rider="Rider:" searchTitle="Rider" handleNewRequest={handleNewRequest} handleApproveRequest={handleApproveRequest}></SearchListRider>
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
                    <SearchProfileView totalRate={totalRate} error={error} success={success} handleApproved={handleApproved} handleRejected={handleRejected} avgRating={avgRating} rider="Rider" data={singleUser} title="Rider Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Rider