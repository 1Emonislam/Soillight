import { Grid } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DashboardGraph from "./Sheard/DashboardGraph"
import DashboardHeader from "./Sheard/DashboardHeader"
import DashboardTableToday from "./Sheard/DashboardTable"
import DashboardTableLastWeek from "./Sheard/DashboardTableLastWeek"

function DashBoard() {
  const navigate = useNavigate();
  const userLogin = useSelector(state => state.userLogin);
  const { user } = userLogin;
  useEffect(() => {
    if (!user?.message) {
      navigate('/login')
    }
  }, [navigate, user?.message])
  const [countData, setCountData] = useState("")
  const [todayData, setTodayData] = useState("")
  const [lastWeekData, setLastWeekData] = useState("")
  const [todayDate, setTodayDate] = useState("")
  const [lastWeekDate, setLastWeekDate] = useState("")
  useEffect(() => {
    // let url = `http://18.142.184.204:7000/dashboard/count`;
    fetch('http://18.142.184.204:7000/dashboard/count', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${user?.token}`
      },
    })
      .then(res => res.json())
      .then(data => {
        setCountData(data?.totalCount)
        setTodayDate(data?.todayDate)
        setTodayData(data?.today)
        setLastWeekDate(data?.lastWeekDate)
        setLastWeekData(data?.lastWeek)
      })
  }, [user.data.token, user?.token])
  return (
    <div>
      {/*dashboard header*/}
      <DashboardHeader title="Dashboard" />
      <DashboardGraph data={countData} />
      <Grid container spacing={2}style={{paddingRight:'30px'}}>
        <Grid item xs={12} md={6}>
          <DashboardTableToday today={todayData} date={todayDate} dateTitle="Today" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardTableLastWeek lastWeek={lastWeekData} dateTitle="Last Week" date={lastWeekDate} />
        </Grid>
      </Grid>
    </div>
  )
}

export default DashBoard