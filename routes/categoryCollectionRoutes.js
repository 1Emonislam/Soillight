const express = require('express');
const router = express.Router();
const { categoryCreate, subCategoryCreate, insideSubCategoryCreate, insidePackTypeCreate, insideServingSizeCreate, categoryUpdate, subCategoryUpdate, insidePackTypeUpdate, insideSubCategoryUpdate, insideServingSizeUpdate, getCategory, categoryGet, subCategoryGet, insidePackTypeGet, insideSubCategoryGet, insideServingSizeGet, deleteCategory, deleteSubCategory, deleteInsideSubCategory, deletePackType, deleteServingSize } = require('../controllers/categoryCollectionControllers');
const { protect } = require('../middlewares/authMiddleware');
router.post('/category', protect, categoryCreate);
router.post('/sub/category', protect, subCategoryCreate);
//categories all search
router.get('/sub/category', protect, subCategoryGet);
router.get('/inside/pack/type', protect, insidePackTypeGet);
router.get('/inside/sub/category', protect, insideSubCategoryGet);
router.get('/inside/serving/size', protect, insideServingSizeGet);
//categories search ended
router.post('/inside/pack/type', protect, insidePackTypeCreate);
router.post('/inside/sub/category', protect, insideSubCategoryCreate);
router.post('/inside/serving/size', protect, insideServingSizeCreate);
router.put('/category/:id', protect, categoryUpdate);
router.put('/sub/category/:id', protect, subCategoryUpdate);
router.put('/inside/pack/type/:id', protect, insidePackTypeUpdate);
router.put('/inside/sub/category/:id', protect, insideSubCategoryUpdate);
router.put('/inside/serving/size/:id', protect, insideServingSizeUpdate);
router.get('/category', protect, categoryGet);
router.get('/sub/category/:id', protect, subCategoryGet);
router.get('/inside/pack/type/:id', protect, insidePackTypeGet);
router.get('/inside/sub/category/:id', protect, insideSubCategoryGet);
router.get('/inside/serving/size/:id', protect, insideServingSizeGet);
router.delete('/category/:id', protect, deleteCategory);
router.delete('/sub/category/:id', protect, deleteSubCategory);
router.delete('/inside/pack/type/:id', protect,deletePackType );
router.delete('/inside/sub/category/:id', protect,deleteInsideSubCategory);
router.delete('/inside/serving/size/:id', protect, deleteServingSize);

module.exports = router;