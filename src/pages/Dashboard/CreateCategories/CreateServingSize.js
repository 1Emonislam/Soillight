import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { CATEGORY_STORE, PROGRESS_CATEGORIES, SUB_CATEGORY_STORE } from '../../../management/reducers/AllCetegoryReducer';
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

export default function CreateServingSize({ createServingSizeOpen, handleServingSizeOpen, handleServingSizeClose, setCreateServingSizeOpen }) {
    const dispatch = useDispatch()
    const [categorySearch, setCategorySearch] = useState('');
    const [subCategorySearch, setSubCategorySearch] = useState('');
    const { register, reset, handleSubmit } = useForm();
    const { userLogin, category } = useSelector(state => state)
    useEffect(() => {
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/category?page=1&limit=500&search=${categorySearch || ''}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: CATEGORY_STORE,
                    payload: {
                        category: data.data
                    }
                })
            })
    }, [categorySearch, dispatch, userLogin?.user?.token])
    useEffect(() => {
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/sub/category?page=1&limit=500&search=${subCategorySearch || ''}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                //console.log(data)
                dispatch({
                    type: SUB_CATEGORY_STORE,
                    payload: {
                        subCategory: data.data
                    }
                })
            })
    }, [subCategorySearch, dispatch, userLogin?.user?.token])

    const handleClickSubCategory = (e) => {
        // console.log(e.target.value)
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/sub/category/${e.target?.value}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                //console.log(data)
                dispatch({
                    type: SUB_CATEGORY_STORE,
                    payload: {
                        subCategory: data.data
                    }
                })
            })
    }
    const createServingSize = data => {
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch('http://18.142.184.204:7000/inside/serving/size', {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
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
                open={createServingSizeOpen}
                onClose={handleServingSizeClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '20px' }} onClick={handleServingSizeClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create Serving Size
                        </Typography>
                        <MdCancel />
                    </div>
                    <form onSubmit={handleSubmit(createServingSize)}>
                        <Typography sx={{
                            fontWeight: "bold",
                            mb: 1,
                            fontSize: 14,
                            color: "#464646",
                        }}
                            style={{ fontFamily: `"Poppins", sans-serif` }}>
                            Choose a Category:
                        </Typography>
                        <TextField fullWidth size="small" type="text" onChange={(e) => setCategorySearch(e.target.value)} placeholder="Search Category..." />
                        <select id="category" style={{ padding: '4px 10px', width: "100%", fontSize: '14px', color: 'gray', fontWeight: "bold", marginBottom: '10px' }} {...register("category", { min: 0 })} required onClick={(e) => handleClickSubCategory(e)}>
                            {
                                category?.category?.map((category, index) => (
                                    <option key={index} value={category?._id}> {category?.category}</option>
                                ))
                            }
                        </select>
                        <>
                            <Typography sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: 14,
                                color: "#464646",
                            }}
                                style={{ fontFamily: `"Poppins", sans-serif` }}>
                                Choose a Sub Category:
                            </Typography>
                            <TextField fullWidth size="small" type="text" onChange={(e) => setSubCategorySearch(e.target.value)} placeholder="Search Sub Category..." />
                            <select id="subCategory" style={{ padding: '4px 10px', width: "100%", fontSize: '14px', color: 'gray', fontWeight: "bold", marginBottom: '10px' }} {...register("subCategory", { min: 0 })} required >
                                {
                                    category?.subCategory?.map((subCategory, index) => (
                                        <option key={index} value={subCategory?._id}> {subCategory?.subCategory}</option>
                                    ))
                                }
                            </select>

                        </>

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
                                Serving Size
                            </Typography>
                            <TextField fullWidth placeholder='Serving Size' size="small"    {...register("servingSize", { min: 0 })} required />
                        </Box>
                        {category?.loading ? <CircularProgress /> : <Button type="submit" style={{ textTransform: 'capitalize', marginTop: '30px' }} variant="contained">
                            Create Serving Size
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
