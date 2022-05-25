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
    const [status, setStatus] = useState("")
    const limit = 50;
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const [isOpen, setIsOpen] = useState(false)
    const { user } = userLogin;
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    const handlePendingRequest = async () => {
        setStatus('pending')
        let search = searchText || '';
        try {
            await fetch(`http://18.142.184.204:7000/products/orders/searching?search=${search}&&status=pending&&page=${page}&limit=${limit}`, {
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
    const handleOrderDeliveredRequest = async () => {
        setStatus('delivered')
        let search = searchText || '';
        try {
            await fetch(`http://18.142.184.204:7000/products/orders/searching?search=${search}&&status=delivered&&page=${page}&limit=${limit}`, {
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
    const handleCancelRequest = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setStatus('cancelled')
        let search = searchText || '';
        fetch(`http://18.142.184.204:7000/products/orders/searching?search=${search}&&status=cancelled&&page=${page}&limit=${limit}`, {
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
    }

    useEffect(() => {
        let search = searchText || '';
        fetch(`http://18.142.184.204:7000/products/orders/searching?search=${search}&&status=${status || 'pending'}&&page=${page}&limit=${limit}`, {
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
    }, [page, searchText, status, user?.token]);
    const handleSingleClick = (id) => {
        // console.log(id)
        fetch(`http://18.142.184.204:7000/products/orders/singleOrder/${id}`, {
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
    const orderDelivered = (id) => {
        setIsOpen(true)
        fetch(`http://18.142.184.204:7000/products/order/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify({ status: 'delivered' })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.error) {
                    setIsOpen(false)
                    setOpen(true)
                    setSuccess("")
                      setError(data?.error?.status || data?.error)
                }
                if (data?.data) {
                    // console.log(data)
                    setIsOpen(false)
                    setOpen(true)
                    setError("")
                    setSuccess(data?.message)
                    setSingleUser(data?.data)
                }

            })
    }

    const orderCancelled = (id) => {
        setIsOpen(true)
        fetch(`http://18.142.184.204:7000/products/order/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify({ status: 'cancelled' })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.error) {
                    setIsOpen(false)
                    setSuccess("")
                      setError(data?.error?.status || data?.error)
                    setOpen(true)
                }
                if (data?.data) {
                    setIsOpen(false)
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
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListOrder handleCancelRequest={handleCancelRequest} handleSingleClick={handleSingleClick} count={count} data={orderList} setSearchText={setSearchText} title="" setPage={setPage} limit={limit} order="Order:" searchTitle="Order" handlePendingRequest={handlePendingRequest} handleOrderDeliveredRequest={handleOrderDeliveredRequest}></SearchListOrder>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView isOpen={isOpen} setIsOpen={setIsOpen} error={error} success={success} orderDelivered={orderDelivered} orderCancelled={orderCancelled} orderPending={orderList} order="Order" data={singleUser} title="Order Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Order