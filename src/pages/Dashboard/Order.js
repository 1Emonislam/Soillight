import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListOrder from './SearchListOrder'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function Order() {
    const [searchText, setSearchText] = useState("")
    const [singleUser, setSingleUser] = useState("");
    const [orderList, setOrderList] = useState([])
    const [count, setCount] = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        let search = searchText || '';
        try {
            await fetch(`http://localhost:5000/products/orders/searching?search=${search}&&status=pending&&page=1&&limit=10`, {
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
                        setOrderList(data?.data)
                        setCount(data?.count)
                    }
                })
        }
        catch {

        }

    }
    const handleApproveRequest = async (e) => {
        let search = searchText || '';
        try {
            await fetch(`http://localhost:5000/products/orders/searching?search=${search}status=complete&&page=1&&limit=10`, {
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
                        setOrderList(data?.data)
                        setCount(data?.count)
                    }
                })

        }
        catch {
        }
    }
    
    useEffect(() => {
        let search = searchText || '';
        fetch(`http://localhost:5000/products/orders/searching?search=${search}&&status=pending&&page=1&&limit=10`, {
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
                    setOrderList(data?.data)
                    setCount(data?.count)
                }
            })
    }, [page, searchText, user?.token]);
    const handleSingleClick = (id) => {
        // console.log(id)
        fetch(`http://localhost:5000/products/orders/singleOrder/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
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
            <DashboardHeader title="Order" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={4}>
                    <SearchListOrder handleSingleClick={handleSingleClick} count={count} data={orderList} setSearchText={setSearchText} title=""setPage={setPage}limit={limit} order="Order:" searchTitle="Order" handlePendingRequest={handlePendingRequest} handleApproveRequest={handleApproveRequest}></SearchListOrder>
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
                    <SearchProfileView error={error} success={success} handleApproved={handleApproved} handleRejected={handleRejected} order="Order" data={singleUser} title="Order Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Order