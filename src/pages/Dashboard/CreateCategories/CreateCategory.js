import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { PROGRESS_CATEGORIES } from '../../../management/reducers/AllCetegoryReducer';
const style = {
    position: 'absolute',
    top: '60%',
    left: '50%',
    border: 'none',
    width: '400px',
    outline: 'none',
    borderRadius: '10px',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 4,
};

export default function CreateCategory({ createCategoryOpen, handleCategoryOpen, handleCategoryClose, setCategoryOpen }) {
    const { register, reset, handleSubmit } = useForm();
    const dispatch = useDispatch()
    const { userLogin, category } = useSelector(state => state)
    const [selected, setSelected] = useState("")
    const [previewSource, setPreviewSource] = useState("")
    // console.log(groupData.error)
    const fileReader = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader?.result)
        }
    }
   if (selected.target?.files?.length) {
        const file = selected.target?.files[0];
        fileReader(file)
    }
    const createCategory = data => {
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        if (previewSource) data.img = previewSource;
        fetch('http://18.142.184.204:7000/category', {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                reset()
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                if (data.message) {

                    toast(data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: 'light',
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                if (data.error) {
                    Object.values(data.error).forEach(err => {
                        toast(err, {
                            position: "top-right",
                            autoClose: 5000,
                            theme: 'light',
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
                }
            })
    };
    return (
        <div>
            <Modal
                style={{ overflowY: 'scroll' }}
                open={createCategoryOpen}
                onClose={handleCategoryClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '20px' }} onClick={handleCategoryClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create Category
                        </Typography>
                        <MdCancel />
                    </div>
                    <form onSubmit={handleSubmit(createCategory)}>
                        <Box >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    mb: 1,
                                    fontSize: 14,
                                    color: "#464646",
                                }}
                                style={{ fontFamily: `"Poppins", sans-serif` }}
                            >
                                Category Name
                            </Typography>
                            <TextField fullWidth placeholder='Category Name' size="small"    {...register("category", { min: 0 })} required />
                        </Box>
                        <Box style={{ display: "flex", justifyContent: 'space-around', padding: '10px 0px' }}>
                            {previewSource ? <>
                                <img style={{ width: '100px', height: '100px', position: 'absolute', zIndex: '-1', borderRadius: '100%' }} src={previewSource} alt="chosen" />
                                <label style={{ opacity: 0, background: 'transparent', cursor: 'pointer', padding: '40px', border: 'none' }}>
                                    <input sx={{ color: 'white', opacity: 0, height: '100px', padding: '30px 30px!important' }} onChange={(e) => setSelected(e)} type="file" />
                                </label>
                            </> :
                                <> <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 1,
                                        fontSize: 14,
                                        color: "#464646",
                                    }}
                                    style={{ fontFamily: `"Poppins", sans-serif` }}
                                >
                                    Selecte Image
                                </Typography>
                                    <label className="browseFile">
                                        <input sx={{ background: "blue", color: 'white', marginLeft: '10px', padding: '5px 30px!important' }} onChange={(e) => setSelected(e)} type="file" />
                                    </label></>}
                        </Box>
                        <Box >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    mb: 1,
                                    fontSize: 14,
                                    color: "#464646",
                                }}
                                style={{ fontFamily: `"Poppins", sans-serif` }}
                            >
                                Age
                            </Typography>
                            <TextField fullWidth placeholder='Age' size="small"    {...register("age", { min: 0 })} required />
                        </Box>
                        {category?.loading ? <CircularProgress />
                            : <Button type="submit" style={{ textTransform: 'capitalize', marginTop: '30px' }} variant="contained">
                                Create  Category
                            </Button>}
                    </form>
                    <ToastContainer
                        style={{ color: 'green', marginTop: '10px' }}
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        pauseOnHover
                    />
                </Box>
            </Modal>

        </div>
    );
}
