import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListRider from './SearchListRider'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function Rider() {
    const [searchText, setSearchText] = useState("")
    const [singleUser, setSingleUser] = useState("");
    const [sellerList, setSellerList] = useState([])
    const [count, setCount] = useState("")
    const [avgRating, setAvgRating] = useState("")
    const [totalRate, setTotalRate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [status, setStatus] = useState("")
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1);
    const limit = 50;
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    const handlePendingRequest = async (e) => {
        const search = searchText || '';
        try {
            await fetch(`http://18.142.184.204:7000/dashboard/users/role/status?search=${search}&role=rider&status=pending&page=${page}&limit=${limit}`, {
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
        setStatus('approved')
        const search = searchText || '';
        try {
            await fetch(`http://18.142.184.204:7000/dashboard/users/role/status/latest?search=${search}&role=rider&status=approved&page=${page}&limit=${limit}`, {
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

    useEffect(() => {
        let search = searchText || '';
        fetch(`http://18.142.184.204:7000/dashboard/users/role/status/latest?search=${search}&role=rider&status=${status || 'pending'}&page=${page}&limit=${limit}`, {
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
    }, [page, searchText, status, user?.token]);
    const handleSingleUser = (id) => {
        fetch(`http://18.142.184.204:7000/users/${id}`, {
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
        fetch(`http://18.142.184.204:7000/users/approved/${id}`, {
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
                    setError(data?.error?.status || data?.error?.buyer  || data?.error?.seller || data?.error?.rider || data?.error)
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
    const riderCancelled = (id) => {
        fetch(`http://18.142.184.204:7000/users/rejected/${id}`, {
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
                    setError(data?.error?.status || data?.error?.buyer  || data?.error?.seller || data?.error?.rider || data?.error)
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
            <Grid container spacing={0}>
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListRider handleSingleUser={handleSingleUser} count={count} data={sellerList} setSearchText={setSearchText} title="" setPage={setPage} limit={limit} rider="Rider:" searchTitle="Rider" handlePendingRequest={handlePendingRequest} handleApproveRequest={handleApproveRequest}></SearchListRider>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView totalRate={totalRate} error={error} success={success} riderApproved={handleApproved} riderCancelled={riderCancelled} avgRating={avgRating} rider="Rider" data={singleUser} title="Rider Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Rider