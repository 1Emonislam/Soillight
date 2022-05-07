const { Category, SubCategory, InsideSubCategory, InsidePackType, InsideServingSize } = require("../models/categoryCollectionModel");
const { upload } = require("../utils/file");

const categoryCreate = async (req, res, next) => {
    try {
        const category = req.body?.category;
        let img = req.body?.img;
        const age = req.body?.age;
        if (req?.body?.img) {
            const url = await upload(req?.body?.img);
            img = url.url;
        }
        const create = await Category.create({ category, img, age });
        if (!create) {
            return res.status(400).json({ error: { category: 'Category creation failed!' } })
        }
        return res.status(200).json({ message: "Category Creation Successfully", data: create })

    }
    catch (error) {
        next(error)
    }
}
const subCategoryCreate = async (req, res, next) => {
    try {
        const category = req.body?.category;
        const subCategory = req.body?.subCategory;
        let img = req.body?.img;
        const age = req.body?.age;
        if (req?.body?.img) {
            const url = await upload(req?.body?.img);
            img = url.url;
        }
        const create = await SubCategory.create({ category: category, subCategory, img, age });
        if (!create) {
            return res.status(400).json({ error: { subCategory: 'Sub Category creation failed!' } })
        }
        const resData = await SubCategory.findOne({ _id: create?._id }).populate("category", "_id category img age")
        return res.status(200).json({ message: "Sub Category Creation Successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}
const insideSubCategoryCreate = async (req, res, next) => {
    try {
        const category = req.body?.category;
        const subCategory = req.body?.subCategory;
        const insideSubCategory = req.body?.insideSubCategory;
        const create = await InsideSubCategory.create({ category: category, subCategory: subCategory, insideSubCategory });
        if (!create) {
            return res.status(400).json({ error: { insideSubCategory: 'Inside Sub Category creation failed!' } })
        }
        const resData = await InsideSubCategory.findOne({ _id: create?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age")
        return res.status(200).json({ message: "Inside Sub Category Creation Successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}
const insidePackTypeCreate = async (req, res, next) => {
    try {
        const packType = req.body?.packType;
        const category = req.body?.category;
        const subCategory = req.body?.subCategory;
        const create = await InsidePackType.create({ category: category, subCategory: subCategory, packType });
        if (!create) {
            return res.status(400).json({ error: { packType: 'packType creation failed!' } })
        }
        const resData = await InsidePackType.findOne({ _id: create?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age")
        return res.status(200).json({ message: "pack type Creation Successfully", data: resData })

    }
    catch (error) {
        next(error)
    }
}
const insideServingSizeCreate = async (req, res, next) => {
    try {
        const servingSize = req.body?.servingSize;
        const category = req.body?.category;
        const subCategory = req.body?.subCategory;
        const create = await InsideServingSize.create({ category: category, subCategory: subCategory, servingSize });
        if (!create) {
            return res.status(400).json({ error: { servingSize: 'Serving Size creation failed!' } })
        }
        const resData = await InsideServingSize.findOne({ _id: create?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age")
        return res.status(200).json({ message: "Serving Size Creation Successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}
const categoryGet = async (req, res, next) => {
    try {
        let { page = 1, limit = 30 } = req.query;
        limit = parseInt(limit);
        const keyword = req.query.search ? {
            $or: [
                { category: { $regex: req.query.search, $options: "i" } },
            ],
        } : {};
        const resData = await Category.find(keyword).select("_id category img age").limit(limit * 1).skip((page - 1) * limit);
        const count = await Category.find(keyword).count()
        return res.status(200).json({ message: "Selecte Category", data: resData, count })
    }
    catch (error) {
        next(error)
    }
}
const subCategoryGet = async (req, res, next) => {
    try {
        let { page = 1, limit = 30 } = req.query;
        limit = parseInt(limit);
        const keyword = req.query.search ? {
            $or: [
                { subCategory: { $regex: req.query.search, $options: "i" } },
            ],
        } : { category: req.params.id };
        const resData = await SubCategory.find({ keyword }).select("_id subCategory img age").limit(limit * 1).skip((page - 1) * limit);
        const count = await SubCategory.find({ keyword }).select("_id subCategory img age").count()
        return res.status(200).json({ message: "Selecte Sub Category", data: resData, count })
        
    }
    catch (error) {
        next(error)
    }
}
const insideSubCategoryGet = async (req, res, next) => {
    try {
        let { page = 1, limit = 30 } = req.query;
        limit = parseInt(limit);
        const keyword = req.query.search ? {
            $or: [
                { insideSubCategory: { $regex: req.query.search, $options: "i" } },
            ],
        } : { subCategory: req.params.id };
        const resData = await InsideSubCategory.find(keyword).select("_id insideSubCategory").limit(limit * 1).skip((page - 1) * limit);
        const count = await InsideSubCategory.find(keyword).count()
        return res.status(200).json({ message: "Selecte Inside Sub Category", data: resData, count });
    }
    catch (error) {
        next(error)
    }
}
const insidePackTypeGet = async (req, res, next) => {
    try {
        let { page = 1, limit = 30 } = req.query;
        limit = parseInt(limit);
        const keyword = req.query.search ? {
            $or: [
                { packType: { $regex: req.query.search, $options: "i" } },
            ],
        } : { subCategory: req.params.id };
        const resData = await InsidePackType.find(keyword).select("_id packType").limit(limit * 1).skip((page - 1) * limit);
        const count = await InsidePackType.find(keyword).count()
        return res.status(200).json({ message: "Selecte Inside Pack Type", data: resData, count });

    }
    catch (error) {
        next(error)
    }
}
const insideServingSizeGet = async (req, res, next) => {
    try {
        let { page = 1, limit = 30 } = req.query;
        limit = parseInt(limit);
        const keyword = req.query.search ? {
            $or: [
                { servingSize: { $regex: req.query.search, $options: "i" } },
            ],
        } : { subCategory: req.params.id };
        const resData = await InsideServingSize.find(keyword).select("_id servingSize").limit(limit * 1).skip((page - 1) * limit);
        const count = await InsideServingSize.find(keyword).count()
        return res.status(200).json({ message: "Selecte Serving Size", data: resData, count });

    }
    catch (error) {
        next(error)
    }
}

const categoryUpdate = async (req, res, next) => {
    try {
        const category = req.body?.category;
        const img = req.body?.img;
        const age = req.body?.age;
        const update = await Category.findOneAndUpdate({ _id: req?.params?.id }, {
            category,
            img,
            age
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: { category: 'Category updated failed!' } })
        }
        return res.status(200).json({ message: "Category updated sucessfully", data: update })

    }
    catch (error) {
        next(error)
    }
}
const subCategoryUpdate = async (req, res, next) => {
    try {
        const subCategory = req.body?.subCategory;
        const img = req.body?.img;
        const age = req.body?.age;
        const update = await SubCategory.findOneAndUpdate({ _id: req?.params?.id }, {
            subCategory: subCategory,
            img,
            age
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: { subCategory: 'Sub Category updated failed!' } })
        }
        const resData = await SubCategory.findOne({ _id: update?._id }).populate("category", "_id category img age")
        return res.status(200).json({ message: "Sub category updated successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}
const insideSubCategoryUpdate = async (req, res, next) => {
    try {
        const insideSubCategory = req.body?.insideSubCategory;
        const update = await InsideSubCategory.findOneAndUpdate({ _id: req.params.id }, {
            insideSubCategory
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: { insideSubCategory: 'Inside Sub Category updated failed!' } })
        }
        const resData = await InsideSubCategory.findOne({ _id: update?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age")
        return res.status(200).json({ message: "Inside Sub Category update Successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}
const insidePackTypeUpdate = async (req, res, next) => {
    try {
        const packType = req.body?.packType;
        const update = await InsidePackType.findOneAndUpdate({ _id: req.params.id }, {
            packType
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: { packType: 'Pack Type updated failed!' } })
        }
        const resData = await InsidePackType.findOne({ _id: update?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age").populate("insideSubCategory", "_id insideSubCategory")
        return res.status(200).json({ message: "Pack Updated Successfully", data: resData })

    }
    catch (error) {
        next(error)
    }
}
const insideServingSizeUpdate = async (req, res, next) => {
    try {
        const servingSize = req.body?.servingSize;
        const update = await InsideServingSize.findOneAndUpdate({ _id: req.params.id }, {
            servingSize
        }, { new: true });
        if (!update) {
            return res.status(400).json({ error: { servingSize: 'Serving Size creation failed!' } })
        }
        const resData = await InsideServingSize.findOne({ _id: update?._id }).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize", "_id servingSize")
        return res.status(200).json({ message: "Serving Size Creation Successfully", data: resData })
    }
    catch (error) {
        next(error)
    }
}

const getCategory = async (req, res, next) => {
    try {
        const allCategory = await InsideServingSize.find({}).populate("category", "_id category img age").populate("subCategory", "_id subCategory img age").populate("insideSubCategory", "_id insideSubCategory").populate("packType", "_id packType").populate("servingSize", "_id servingSize");
        return res.status(200).json({ data: allCategory })
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    categoryCreate,
    subCategoryCreate,
    insideSubCategoryCreate,
    insidePackTypeCreate,
    insideServingSizeCreate,
    categoryUpdate,
    subCategoryUpdate,
    insideSubCategoryUpdate,
    insidePackTypeUpdate,
    insideServingSizeUpdate,
    categoryGet,
    subCategoryGet,
    insideSubCategoryGet,
    insidePackTypeGet,
    insideServingSizeGet,
}