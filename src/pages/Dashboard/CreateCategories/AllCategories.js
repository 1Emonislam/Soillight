import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { MdCancel } from 'react-icons/md';
import CreateCategory from './CreateCategory';
import CreateInsideSubCategory from './CreateInsideSubCategory';
import CreatePackType from './CreatePackType';
import CreateServingSize from './CreateServingSize';
import CreateSubCategory from './CreateSubCategory';

const style = {
    position: 'absolute',
    top: '60%',
    left: '50%',
    border: 'none',
    width: '300px',
    outline: 'none',
    borderRadius: '10px',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 4,
};

export default function AllCategoriesCreate({ categoriesOpen, handleCategoriesClose, handleCategoriesOpen }) {
    //create category
    const [createCategoryOpen, setCreateCategoryOpen] = React.useState(false);
    const handleCategoryOpen = () => setCreateCategoryOpen(true)
    const handleCategoryClose = () => setCreateCategoryOpen(false)
    //create subcategory
    const [createSubCategoryOpen, setCreateSubCategoryOpen] = React.useState(false);
    const handleSubCategoryOpen = () => setCreateSubCategoryOpen(true)
    const handleSubCategoryClose = () => setCreateSubCategoryOpen(false)
    //create inside subcategory
    const [createInsideSubCategoryOpen, setCreateInsideSubCategoryOpen] = React.useState(false);
    const handleInsideSubCategoryOpen = () => setCreateInsideSubCategoryOpen(true)
    const handleInsideSubCategoryClose = () => setCreateInsideSubCategoryOpen(false)
    //create packtype 
    const [createPackTypeOpen, setCreatePackTypeOpen] = React.useState(false);
    const handlePackTypeOpen = () => setCreatePackTypeOpen(true)
    const handlePackTypeClose = () => setCreatePackTypeOpen(false)
    //create Serving Size
    const [createServingSizeOpen, setCreateServingSizeOpen] = React.useState(false);
    const handleServingSizeOpen = () => setCreateServingSizeOpen(true)
    const handleServingSizeClose = () => setCreateServingSizeOpen(false)
    return (
        <div>
            <Modal
                style={{ overflowY: 'scroll' }}
                open={categoriesOpen}
                onClose={handleCategoriesClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '20px' }} onClick={handleCategoriesClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Categories
                        </Typography>
                        <MdCancel />
                    </div>
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}> </Typography>
                        <Button onClick={() => {
                            setCreateCategoryOpen(true)

                        }} style={{ textTransform: 'capitalize' }}>
                            Create Category
                        </Button>
                        <CreateCategory createCategoryOpen={createCategoryOpen} handleCategoryOpen={handleCategoryOpen} handleCategoryClose={handleCategoryClose} setCreateCategoryOpen={setCreateCategoryOpen} />
                    </>
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}> </Typography>
                        <Button onClick={() => setCreateSubCategoryOpen(true)} style={{ textTransform: 'capitalize' }}>
                            Create Sub Category
                        </Button>
                        <CreateSubCategory createSubCategoryOpen={createSubCategoryOpen} handleSubCategoryOpen={handleSubCategoryOpen} handleSubCategoryClose={handleSubCategoryClose} setCreateSubCategoryOpen={setCreateSubCategoryOpen} />
                    </>
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}> </Typography>
                        <Button onClick={() => setCreateInsideSubCategoryOpen(true)} style={{ textTransform: 'capitalize' }}>
                            Create inside Sub Category
                        </Button>
                        <CreateInsideSubCategory createInsideSubCategoryOpen={createInsideSubCategoryOpen} handleInsideSubCategoryOpen={handleInsideSubCategoryOpen} handleInsideSubCategoryClose={handleInsideSubCategoryClose} setCreateInsideSubCategoryOpen={setCreateInsideSubCategoryOpen} />
                    </>
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}> </Typography>
                        <Button onClick={() => setCreatePackTypeOpen(true)} style={{ textTransform: 'capitalize' }}>
                            Create Pack Type
                        </Button>
                        <CreatePackType createPackTypeOpen={createPackTypeOpen} handlePackTypeOpen={handlePackTypeOpen} handlePackTypeClose={handlePackTypeClose} setCreatePackTypeOpen={setCreatePackTypeOpen} />
                    </>
                    <>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}> </Typography>
                        <Button onClick={() => setCreateServingSizeOpen(true)} style={{ textTransform: 'capitalize' }}>
                            Create Serving Size
                        </Button>
                        <CreateServingSize createServingSizeOpen={createServingSizeOpen} setCreateServingSizeOpen={setCreateServingSizeOpen} handleServingSizeOpen={handleServingSizeOpen} handleServingSizeClose={handleServingSizeClose} />
                    </>
                </Box>
            </Modal>
        </div>
    );
}