import { Alert, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../management/actions/userActions';
import '../Dashboard/Profile.css';
import DashboardHeader from '../Dashboard/Sheard/DashboardHeader';
function EditProfile() {
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logOut())
  }
  const userLogin = useSelector(state => state.userLogin);
  const { user } = userLogin;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, reset, handleSubmit } = useForm();
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "profile-photo");
    data.append("cloud_name", "wesoftin");
    fetch("https://api.cloudinary.com/v1_1/wesoftin/image/upload", {
      method: "POST",
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      });
  };
  // console.log(url && url)
  const onSubmit = data => {
    //http://18.142.184.204:7000
    fetch(`http://18.142.184.204:7000/users`, {
      method: 'PUT',
      headers: {
        "access-control-allow-origin": "*",
        'Content-type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        reset()
        // console.log(data.user)
        if (data?.error) {
          setError(data?.error?.password);
          setError(data?.error?.token)
        }
        // console.log(data)
        if (data?.message) {
          setOpen(true)
          setError("")
          setSuccess(data.message)
          handleLogOut();
          window.location.replace('/dashboard/dashboard')
        }
      })
  }
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 7000);
  }, [error])
  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 7000);
  }, [open]);
  useEffect(() => {
    if (url) {
      fetch(`http://18.142.184.204:7000/users`, {
        method: 'PUT',
        headers: {
          "access-control-allow-origin": "*",
          'Content-type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ pic: url }),
      })
        .then(response => response.json())
        .then(data => {
          reset()
          // console.log(data.user)
          if (data?.error) {
            setError(data?.error?.password);
            setError(data?.error?.token)
          }
          // console.log(data)
          if (data?.message) {
            setOpen(true)
            setError("")
            setSuccess(data.message)
            window.localStorage.removeItem("user");
            window.location.replace("/login")
          }
        })
    }

  }, [reset, url, user?.token])
  return (
    <div>
      <DashboardHeader title="Edit Profile" />
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginTop: '50px' }}>
        {error && <Grid item xs={12} >
          <div>
            <Alert severity="error" timeout={5000} md={6}>{error}</Alert>
          </div>
        </Grid>}
        {success && <Grid item xs={12} timeout={5000} md={6}>
          <div>
            <Alert severity="success" timeout={5000} md={6}> {success}</Alert>
          </div>
        </Grid>}
      </Grid>
      <div className="profile-section">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} alignContent="center">
            <Grid item xs={12} className="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '40px 0', position: 'relative', left: '-40px' }}>
              <p > Account</p>
              <div>
                <>{<img style={{ width: '100px', height: '100px', borderRadius: '100px', border: '6px solid #F5AB24' }} src={url || user?.data?.pic} alt={user?.data?.name} />}</>
                <input
                  className="input-field file-upload profile-edit" style={{ opcity: '0', position: 'absolute', width: '30px', height: '30px' }}
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  onBlur={uploadImage} placeholder="Select Profile" />
              </div>
              <Button variant="contained" type="submit" style={{ background: '#3858CD' }}> Save</Button>
            </Grid>
            <Grid item xs={12}>
              <div>
                <Grid container spacing={0} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={2}>
                    <p>Username</p>
                  </Grid>
                  <Grid item xs={12} md={8} justifyContent="center" alignItems="center">
                    <input {...register("name", { required: true, min: 1 })} defaultValue={user?.data?.name} type="text" />
                  </Grid>
                </Grid>
              </div>
              <div>
                <Grid container spacing={0} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={2}>
                    <p>Email</p>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <input {...register("email", { required: true, min: 1 })} defaultValue={user?.data?.email} type="email" />
                  </Grid>
                </Grid>
              </div>
              <div>
                <Grid container spacing={0} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={2}>
                    <p>Phone Number</p>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <input {...register("phone", { required: true, min: 1 })} defaultValue={user?.data?.phone} type="text" required />
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </div >
  )
}

export default EditProfile