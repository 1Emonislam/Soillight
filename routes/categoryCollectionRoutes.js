const express = require('express');
const router = express.Router();
const { categoryCreate, subCategoryCreate, insideSubCategoryCreate, insidePackTypeCreate, insideSurvingSizeCreate, categoryUpdate, subCategoryUpdate, insidePackTypeUpdate, insideSubCategoryUpdate, insideSurvingSizeUpdate, getCategory } = require('../controllers/categoryCollectionControllers');
const { protect } = require('../middlewares/authMiddleware');
router.post('/category', protect, categoryCreate);
router.post('/sub/category', protect, subCategoryCreate);
router.post('/inside/pack/type', protect, insidePackTypeCreate);
router.post('/inside/sub/category', protect, insideSubCategoryCreate);
router.post('/inside/serving/size', protect, insideSurvingSizeCreate);
router.put('/category/:id', protect, categoryUpdate);
router.put('/sub/category/:id', protect, subCategoryUpdate);
router.put('/inside/pack/type/:id', protect, insidePackTypeUpdate);
router.put('/inside/sub/category/:id', protect, insideSubCategoryUpdate);
router.put('/inside/serving/size/:id', protect, insideSurvingSizeUpdate);
router.get('/getCategory', protect, getCategory)
module.exports = router;