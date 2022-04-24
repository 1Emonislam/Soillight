const express = require('express');
const { categoryCreate, subCategoryCreate, insideSubCategoryCreate, insidePackTypeCreate, insideSurvingSizeCreate } = require('../controllers/categoryCollectionControllers');
const { protect } = require('../middlewares/authMiddleware');
router.post('/category', protect, categoryCreate);
router.post('/sub/category', protect, subCategoryCreate);
router.post('/inside/pack/type', protect, insidePackTypeCreate);
router.post('/inside/sub/category', protect, insideSubCategoryCreate);
router.post('/inside/serving/size', protect, insideSurvingSizeCreate);
module.exports = router;