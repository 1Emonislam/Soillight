import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListWithdrawTrans from './SearchListWithdrawTrans'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function WithdrawTransaction() {
    const [searchText, setSearchText] = useState("")
    const [singleWithdrawTrans, setSingleWithdrawTrans] = useState("");
    const [withdrawTransList, setWithdrawTransList] = useState([])
    const [count, setCount] = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1);
    const limit = 50;
    const navigate = useNavigate();
    const [status, setStatus] = useState("")
    const userLogin = useSelector(state => state.userLogin);
    const [isOpen, setIsOpen] = useState(false)
    const { user } = userLogin;
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message])
    const handlePendingRequest = async (e) => {
        let search = searchText || '';
        setStatus('pending')
        try {
            await fetch(`http://18.142.184.204:7000/balance/withdraw/status/history?search=${search}&status=pending&page=${page}&limit=${limit}`, {
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
                        setWithdrawTransList(data?.data)
                        setCount(data?.count)
                    }
                })
        }
        catch {

        }

    }
    const handleApproveRequest = async (e) => {
        let search = searchText || '';
        setStatus('approved')
        try {
            await fetch(`http://18.142.184.204:7000/balance/withdraw/status/history?search=${search}&status=approved&page=${page}&limit=${limit}`, {
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
                        setWithdrawTransList(data?.data)
                        setCount(data?.count)
                    }
                })

        }
        catch {
        }
    }
    const handleCancelledRequest = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setStatus('cancelled')
        let search = searchText || '';
        fetch(`http://18.142.184.204:7000/balance/withdraw/status/history?search=${search}&status=cancelled&page=${page}&limit=${limit}`, {
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
                    setWithdrawTransList(data?.data)
                    setCount(data?.count)
                }
            })

    }

    useEffect(() => {
        let search = searchText || '';
        let statusText = status || '';
        fetch(`http://18.142.184.204:7000/balance/withdraw/status/history?search=${search}&status=${statusText || 'pending'}&page=${page}&limit=${limit}`, {
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
                    setWithdrawTransList(data?.data)
                    setCount(data?.count)
                }
            })
    }, [page, searchText, status, user?.token]);
    const handleSingleClick = (id) => {
        // console.log(id)
        fetch(`http://18.142.184.204:7000/balance/withdraw/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setSingleWithdrawTrans(data?.data)
            })
    }
    const withdrawApproved = (id) => {
        setIsOpen(true)
        // console.log(id)
        fetch(`http://18.142.184.204:7000/balance/withdraw/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify({ status: 'approved' })
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data?.error) {
                    setIsOpen(false)
                    setOpen(true)
                    setSuccess("")
                    setError(data?.error.status || data?.error?.admin)
                }
                if (data?.data) {
                    // console.log(data)
                    setIsOpen(false)
                    setOpen(true)
                    setError("")
                    setSuccess(data?.message)
                    setSingleWithdrawTrans(data?.data)
                }

            })
    }

    const withdrawCancelled = (id) => {
        setIsOpen(true)
        fetch(`http://18.142.184.204:7000/balance/withdraw/status/${id}`, {
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
                    setSingleWithdrawTrans(data?.data)
                    setOpen(true)
                }
            })
    }
    useEffect(
        () => {
            setTimeout(() => {
                setOpen(true)
            }, 5000)
            return () => {
                clearTimeout();
            };
        }, [open]);
    return (
        <div>
            <DashboardHeader title="Transaction History" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListWithdrawTrans handleCancelledRequest={handleCancelledRequest} handleSingleClick={handleSingleClick} count={count} data={withdrawTransList} setSearchText={setSearchText} title="Transaction History" setPage={setPage} limit={limit} product="Transaction History" searchTitle="Transaction History" handlePendingRequest={handlePendingRequest} handleApproveRequest={handleApproveRequest}></SearchListWithdrawTrans>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView isOpen={isOpen} setIsOpen={setIsOpen} error={error} success={success} withdrawApproved={withdrawApproved} withdrawCancelled={withdrawCancelled} withdraw="Transaction History" data={singleWithdrawTrans} title="Transaction Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default WithdrawTransaction