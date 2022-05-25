import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
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

export default function PackTypeDetails({ handlePackTypeDetailsClose, handlePackTypeDetailsOpen, packTypeOpen }) {
    const { register, reset, handleSubmit } = useForm();
    const dispatch = useDispatch()
    const { userLogin, category } = useSelector(state => state)
    const {selectedPackType} = category;
    const updatePackType = data => {
        if (!selectedPackType?._id) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/inside/pack/type/${selectedPackType?._id}`, {
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
    const deletePackType = () => {
        if (!selectedPackType?._id) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/inside/pack/type/${selectedPackType?._id}`, {
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
                open={packTypeOpen}
                onClose={handlePackTypeDetailsClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '20px' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Update PackType
                        </Typography>
                        <MdCancel onClick={handlePackTypeDetailsClose} />
                    </div>
                    <form onSubmit={handleSubmit(updatePackType)}>
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
                                Pack Type
                            </Typography>
                            {/* {console.log(insideSubCategoryInfo)} */}
                            <TextField fullWidth placeholder={selectedPackType?.packType} size="small"    {...register("packType", { min: 0 })} required />
                        </Box>
                        {category?.loading ? <CircularProgress />
                            : <>
                                <Button type="submit" style={{ textTransform: 'capitalize', marginTop: '30px' }} variant="contained">
                                   Update PackType
                                </Button>
                                <Button onClick={deletePackType} style={{ textTransform: 'capitalize', marginTop: '30px', marginLeft: '20px', background: 'red' }} variant="contained">
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
