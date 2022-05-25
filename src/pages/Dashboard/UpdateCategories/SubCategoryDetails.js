import { Box, Button, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdCancel } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { PROGRESS_CATEGORIES, SUB_CATEGORY_STORE } from '../../../management/reducers/AllCetegoryReducer';
import Loading from '../Sheard/Loading';
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

export default function SubCategoryDetails({ handleSubCategoryDetailsClose, handleSubCategoryDetailsOpen, subCategoryDetailsOpen }) {
    const { register, reset, handleSubmit } = useForm();
    const dispatch = useDispatch()
    const { userLogin, category } = useSelector(state => state)
    const { selectedSubCategory } = category;
    const [selected, setSelected] = useState("")
    const [previewSource, setPreviewSource] = useState("")
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
    const updateSubCategory = data => {
        if (!selectedSubCategory?._id) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        if (previewSource) data.img = previewSource;
        fetch(`http://18.142.184.204:7000/sub/category/${selectedSubCategory?._id}`, {
            method: 'PUT',
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
                dispatch({
                    type: SUB_CATEGORY_STORE,
                    payload: {
                        loading: data.data
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
                    window.location.reload()
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
    const deleteSubCategory = () => {
        if (!selectedSubCategory?._id) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/sub/category/${selectedSubCategory?._id}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
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
                dispatch({
                    type: SUB_CATEGORY_STORE,
                    payload: {
                        loading: data.data
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
                    window.location.reload()
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
                open={subCategoryDetailsOpen}
                onClose={handleSubCategoryDetailsClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '20px' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Update Sub Category
                        </Typography>
                        <MdCancel onClick={handleSubCategoryDetailsClose} />
                    </div>
                    <form onSubmit={handleSubmit(updateSubCategory)}>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: 14,
                                color: "#464646",
                            }}
                            style={{ fontFamily: `"Poppins", sans-serif` }}
                        >
                            Sub Category Name
                        </Typography>
                        <TextField fullWidth placeholder={selectedSubCategory?.subCategory} size="small"    {...register("subCategory", { min: 0 })} required />
                            {/* {console.log(selectedSubCategory)} */}
                        <Box style={{ display: "flex", justifyContent: 'space-around', padding: '10px 0px' }}>
                            <img style={{ width: '100px', height: '100px', position: 'absolute', zIndex: '-1', borderRadius: '100%' }} src={previewSource || selectedSubCategory?.img} alt="chosen" />
                            <label style={{ opacity: 0, background: 'transparent', cursor: 'pointer', padding: '40px', border: 'none' }}>
                                <input sx={{ color: 'white', opacity: 0, height: '100px', padding: '30px 30px!important' }} onChange={(e) => setSelected(e)} type="file" />
                            </label>
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
                            <TextField fullWidth placeholder={selectedSubCategory?.age} size="small"    {...register("age", { min: 0 })} required />
                        </Box>
                        {category?.loading ? <Loading />
                            : <>
                                <Button type="submit" style={{ textTransform: 'capitalize', marginTop: '30px' }} variant="contained">
                                    Update Sub  Category
                                </Button>
                                
                                <Button onClick={deleteSubCategory} style={{ textTransform: 'capitalize', marginTop: '30px', marginLeft: '20px', background: 'red' }} variant="contained">
                                    Delete
                                </Button>
                            </>}
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
