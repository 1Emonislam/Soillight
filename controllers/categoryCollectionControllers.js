const CategoryCollection = require("../models/categoryCollectionModel");

const categoryCollectionAdd = async (req, res, next) => {
    const { category, subCategory } = req.body;
    try {
        const created = await CategoryCollection.create({ category, subCategory, user: req?.user?._id });
        if (created) {
            return res.status(201).json({ message: 'you have successfully new Category', data: created });
        } if (!created) {
            return res.status(400).json({ error: { category: 'category creation failed!' } })
        }
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionRemove = async (req, res, next) => {
    try {
        await CategoryCollection.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) {
                return res.status(200).json({ error: { category: "category removed failed!" } })
            }
            if (!err) {
                return res.status(200).json({ message: "You have successfully Removed!" })
            }
        });
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionUpdate = async (req, res, next) => {
    try {
        const { category, subCategory } = req.body;
        const updated = await CategoryCollection.findByIdAndUpdate({ _id: req.params.id }, {
            category, subCategory
        }, { new: true })
        if (!updated) {
            return res.status(400).json({ error: { category: "Category updated failed!" } })
        }
        if (updated) {
            return res.status(200).json({ message: "You have successfully updated!" })
        }
    }
    catch (error) {
        next(error)
    }
}
const categoryCollectionGet = async (req, res, next) => {
    try {
        const data = await CategoryCollection.find({});
        return res.status(200).json({ data: data })
    }
    catch (error) {
        next(error)
    }
}
module.exports = { categoryCollectionGet, categoryCollectionAdd, categoryCollectionRemove, categoryCollectionUpdate }