import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SearchListProduct from './SearchListProduct'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchProfileView from './Sheard/SearchProfileView'
function Product() {
    const [searchText, setSearchText] = useState("")
    const [singleProduct, setSingleProduct] = useState("");
    const [productList, setProductList] = useState([])
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
            await fetch(`http://18.142.184.204:7000/products/all?search=${search}&status=pending&page=${page}&limit=${limit}`, {
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
                        setProductList(data?.data)
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
            await fetch(`http://18.142.184.204:7000/products/all?search=${search}&status=approved&page=${page}&limit=${limit}`, {
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
                        setProductList(data?.data)
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
        fetch(`http://18.142.184.204:7000/products/all?search=${search}&status=cancelled&page=${page}&limit=${limit}`, {
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
                    setProductList(data?.data)
                    setCount(data?.count)
                }
            })

    }

    useEffect(() => {
        let search = searchText || '';
        let statusText = status || '';
        fetch(`http://18.142.184.204:7000/products/all?search=${search}&status=${statusText || 'pending'}&page=${page}&limit=${limit}`, {
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
                    setProductList(data?.data)
                    setCount(data?.count)
                }
            })
    }, [page, searchText, status, user?.token]);
    const handleSingleClick = (id) => {
        // console.log(id)
        fetch(`http://18.142.184.204:7000/products/singleProduct/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setError(data?.error?.token || data?.error)
                setSingleProduct(data?.data)
            })
    }
    const productApproved = (id) => {
        setIsOpen(true)
        // console.log(id)
        fetch(`http://18.142.184.204:7000/products/status/${id}`, {
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
                    setSingleProduct(data?.data)
                }

            })
    }

    const productCancelled = (id) => {
        setIsOpen(true)
        fetch(`http://18.142.184.204:7000/products/status/${id}`, {
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
                    setSingleProduct(data?.data)
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
            <DashboardHeader title="Product" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListProduct handleCancelledRequest={handleCancelledRequest} handleSingleClick={handleSingleClick} count={count} data={productList} setSearchText={setSearchText} title="Products" setPage={setPage} limit={limit} product="Products" searchTitle="Products" handlePendingRequest={handlePendingRequest} handleApproveRequest={handleApproveRequest}></SearchListProduct>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView isOpen={isOpen} setIsOpen={setIsOpen} error={error} success={success} productApproved={productApproved} productCancelled={productCancelled} product="Product" data={singleProduct} title="Prdouct Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Product