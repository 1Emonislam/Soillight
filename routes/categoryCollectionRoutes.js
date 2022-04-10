const express = require('express');
const { categoryCollectionAdd, categoryCollectionRemove, categoryCollectionUpdate, categoryCollectionGet, subCategoryAndCategoryCollectionGet } = require('../controllers/categoryCollectionControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("/category-collection-get").get(categoryCollectionGet)
router.route("/category-collection-add").post(protect, categoryCollectionAdd)
router.route("/category-collection-update").put(protect, categoryCollectionUpdate)
router.route("/category-collection-removed").delete(protect, categoryCollectionRemove)
router.route("/sub-category-and-category-collection-get").get(subCategoryAndCategoryCollectionGet)
module.exports = router;