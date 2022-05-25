import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from './Sheard/DashboardHeader'
import SearchListBuyer from './Sheard/SearchListBuyer'
import SearchProfileView from './Sheard/SearchProfileView'
function Buyer() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("")
    const [singleUser, setSingleUser] = useState("");
    const userLogin = useSelector(state => state.userLogin);
    const { user } = userLogin;
    useEffect(() => {
        if (!user?.message) {
            navigate('/login')
        }
    }, [navigate, user?.message]);
    const [buyerList, setBuyerList] = useState([])
    const [count, setCount] = useState("")
    const [avgRating, setAvgRating] = useState("")
    const [totalRate, setTotalRate] = useState("")
    const [page, setPage] = useState(1);
    const limit = 50;
    useEffect(() => {
        let search = searchText || '';
        fetch(`http://18.142.184.204:7000/dashboard/users/role?search=${search}&role=buyer&page=${page}&limit=${limit}`, {
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
                    setBuyerList(data?.data)
                    setCount(data?.count)
                }
            })
    }, [page, searchText, user?.token]);
    const [chkValue, setChkValue] = useState(false);
    const handleSingleUser = (id) => {
        setChkValue(!chkValue)
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
                // console.log(data)
                setTotalRate(data?.totalRate)
                setAvgRating(data.avgRating)
                setSingleUser(data?.data)
            })
    }
    return (
        <div>
            <DashboardHeader title="Buyer" />
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <SearchListBuyer handleSingleUser={handleSingleUser} count={count} data={buyerList} setSearchText={setSearchText}setPage={setPage}limit={limit} title="Buyer List" searchTitle="Buyer"></SearchListBuyer>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <SearchProfileView totalRate={totalRate} buyer="buyer" avgRating={avgRating} data={singleUser} title="Buyer Info" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Buyer