import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListSeller from './SearchListSeller'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function Seller() {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    const [page, setPage] = useState(1);
    const limit = 50;
    const [searchText, setSearchText] = useState("")
    const [singleUser, setSingleUser] = useState("");
    const [sellerList, setSellerList] = useState([])
    const [count, setCount] = useState("")
    const [avgRating, setAvgRating] = useState("")
    const [totalRate, setTotalRate] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [status, setStatus] = useState("")
    const [open, setOpen] = useState("");
    // const[latest,setLatest] = useState("")
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    const handlePendingRequest = async (e, latest) => {
        let search = searchText || '';
        // setLatest()
        try {
            await fetch(`http://18.142.184.204:7000/dashboard/users/role/status?search=${search}&role=seller&status=pending&page=${page}&limit=${limit}`, {
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
    const handleApproveRequest = async () => {
        setStatus('approved')
        let search = searchText || '';
        try {
            await fetch(`http://18.142.184.204:7000/dashboard/users/role/status?search=${search}&role=seller&status=approved&page=${page}&limit=${limit}`, {
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

        fetch(`http://18.142.184.204:7000/dashboard/users/role/status?search=${search}&role=seller&status=${status || 'pending'}&page=${page}&limit=${limit}`, {
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
        // console.log(id)
        // console.log(index)
        fetch(`http://18.142.184.204:7000/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data?.error) {
                      setError(data?.error?.status || data?.error)
                }
                if (data?.data) {
                    setError("")
                    setTotalRate(data?.totalRate)
                    setAvgRating(data.avgRating)
                    setSingleUser(data?.data)
                }
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
                    setSuccess("")
                      setError(data?.error?.status || data?.error)
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
    const handleRejected = (id) => {
        fetch(`http://18.142.184.204:7000/users/rejected/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
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
    useEffect(
        () => {
            let timer1 = setTimeout(() => setOpen(true), 5 * 1000)
            return () => {
                clearTimeout(timer1);
            };
        }, [open]);
    return (
        <div>
            <DashboardHeader title="Seller" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListSeller handleSingleUser={handleSingleUser} count={count} data={sellerList} setSearchText={setSearchText} setPage={setPage} limit={limit} title="" seller="Seller:" searchTitle="Seller" handlePendingRequest={handlePendingRequest} handleApproveRequest={handleApproveRequest}></SearchListSeller>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView totalRate={totalRate} error={error} success={success} handleRejected={handleRejected} handleApproved={handleApproved} seller="seller" avgRating={avgRating} data={singleUser} title="Seller Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Seller