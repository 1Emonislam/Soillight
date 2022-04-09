const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategory");
const categoryCollectionAdd = async (req, res, next) => {
    //category
    const categoryName = req.body?.category?.name;
    const categoryImage = req.body?.category?.img;
    const categoryId = req.body?.category?.categoryId;
    //sub category 
    const subcategoryName = req.body?.subCategory?.name;
    const subcategoryImage = req.body?.subCategory?.img;
    try {
        if (categoryId) {
            const created = await SubCategory.create({ name: subcategoryName, img: subcategoryImage, category: categoryId });
            return res.status(201).json({ message: 'you have created new Sub Category', data: created }).populate("category");
        }
        if (!categoryId) {
            const created = await Category.create({ name: categoryName, img: categoryImage });
            const resData = await Category.findOne({ _id: created?._id })
            return res.status(201).json({ message: 'you have created new Category', data: resData });
        }
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionRemove = async (req, res, next) => {
    const { categoryId, subCategoryId } = req.body;
    try {
        const issue = {}
        let message = {};
        if (categoryId && subCategoryId) {
            await Category.findOneAndRemove({ _id: categoryId }, function (err) {
                if (err) {
                    issue.category = 'category removed failed!'
                }
                if (!err) {
                    message.message = "Category Removed!"
                }
            });
            await SubCategory.findOneAndRemove({ _id: subCategoryId, category: categoryId }, function (err) {
                if (err) {
                    issue.subCategory = 'SubCategory removed failed!'
                }
                if (!err) {
                    message.message = "Removed category and subCategory!"
                }
            });
            if (Object.keys(issue)?.length) {
                return res.status(400).json({ error: issue })
            }
            if (Object.keys(message)?.length) {
                return res.status(200).json({ message: message?.message })
            }
        }
        if (categoryId) {
            await Category.findOneAndRemove({ _id: categoryId }, function (err) {
                if (err) {
                    return res.status(400).json({ category: 'Category removed failed!' })
                }
                if (!err) {
                    return res.status(200).json({ message: "Category Removed!" })
                }
            });
        }
        if (subCategoryId) {
            await SubCategory.findOneAndRemove({ _id: subCategoryId }, function (err) {
                if (err) {
                    return res.status(400).json({ category: 'SubCategory removed failed!' })
                }
                if (!err) {
                    return res.status(200).json({ message: "Sub Category Removed!" })
                }
            });
        }
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionUpdate = async (req, res, next) => {
    try {
        const categoryName = req.body?.category?.name;
        const categoryImage = req.body?.category?.img;
        //sub category 
        const subcategoryName = req.body?.subCategory?.name;
        const subcategoryImage = req.body?.subCategory?.img;
        const categoryId = req.body?.category?.categoryId;
        const subCategoryId = req.body?.subCategory?.subCategoryId;
        if (categoryId && subCategoryId) {
            const update = await Category.findOneAndUpdate({ _id: categoryId }, { name: categoryName, img: categoryImage }, { new: true });
            const subUpdate = await SubCategory.findOneAndUpdate({ _id: subCategoryId, category: categoryId }, { name: subcategoryName, img: subcategoryImage, category: categoryId }, { new: true }).populate("category");
            return res.status(201).json({ message: 'Category and sub getegory update successfully!', cetagory: update, subCategory: subUpdate });
        }
        if (subCategoryId) {
            const update = await SubCategory.findOneAndUpdate({ _id: subCategoryId }, { name: subcategoryName, img: subcategoryImage }, { new: true }).populate("category");
            return res.status(201).json({ message: 'Sub Category update successfully!', data: update });
        }
        if (categoryId) {
            const update = await Category.findOneAndUpdate({ _id: categoryId }, { name: categoryName, img: categoryImage }, { new: true });
            return res.status(200).json({ message: 'Category update successfully!', data: update });
        }
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionGet = async (req, res, next) => {
    try {
        const data = await SubCategory.find({}).populate("category");
        return res.status(200).json({ data: data })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { categoryCollectionGet, categoryCollectionAdd, categoryCollectionRemove, categoryCollectionUpdate }