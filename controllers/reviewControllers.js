const ProductReview = require('../models/productReviewModel');
const Product = require('../models/productModel')
const giveAReview = async (req, res, next) => {
    const { rating, comment } = req.body;
    // console.log(Number(rating))
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "product": "Product review failed! Please enter a minimum of 1 to a maximum of 5" } })
    }
    try {
        // console.log(req?.params?.id)
        const product = await Product.findOne({ _id: req?.params?.id });
        // console.log(product)
        if (product) {
            const productReviewed = await ProductReview.findOne({ user: req?.user?._id, product: req.params.id })
            if (productReviewed) {
                return res.status(400).json({ error: { "product": "Product already reviewed!" } })
            } else {
                const review = {
                    name: req?.user?.name,
                    rating: Number(rating),
                    comment,
                    user: req?.user?._id,
                    product: req?.params?.id
                }
                const reviewAdded = await ProductReview.create(review);
                product.reviews.unshift(reviewAdded._id);
                const finding = await ProductReview.find({ product: req.params.id });
                product.numReviews = finding?.length;
                product.rating = finding.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
                await product.save();
                return res.status(201).json({ message: 'Review added' });
            }
        } else {
            return res.status(404).json({ error: { "product": "Product review failed!" } })
        }
    }
    catch (error) {
        next(error)
    }
}
const reviewUpdate = async (req, res, next) => {
    const { rating, comment } = req.body;
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "product": "Product review rate! Please enter a minimum of 1 to a maximum of 5" } })
    }
    const product = await Product.findOne({ _id: req?.params?.id });
    try {
        if (product) {
            const review = {
                name: req?.user?.name,
                rating: Number(rating),
                comment,
                user: req?.user?._id,
                product: req?.params?.id
            }
            const reviewUpdate = await ProductReview.updateOne({ product: req.params.id, user: req?.user?._id }, review, { new: true });
            if (reviewUpdate) {
                const finding = await ProductReview.find({ product: req.params.id });
                product.numReviews = finding?.length;
                product.rating = finding.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
                await product.save();
                const resReview = await ProductReview.findOne({ product: req.params.id, user: req?.user?._id });
                if (resReview) {
                    return res.status(200).json({ message: "Review update successfully!", resReview })
                } else {
                    return res.status(400).json({ error: { "product": "Review update failed!" } })
                }
            }
        } else {
            return res.status(404).json({ error: { "product": "Product not founds!" } })
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { giveAReview, reviewUpdate }