const ProductReview = require('../models/productReviewModel');
const Product = require('../models/productModel')
const giveAReview = async (req, res, next) => {
    const { rating, comment } = req.body;
    // console.log(Number(rating))
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "product": "Product review failed! Please enter a minimum of 1 to a maximum of 5" } })
    }
    try {
        const product = await Product.findOne({ _id: req?.params?.id });
        if (product) {
            const productReviewed = await ProductReview.findOne({ user: req.user._id, product: req.params.id })
            if (productReviewed) {
                res.status(400).json({ error: { "product": "Product already reviewed!" } })
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
                product.numReviews = product.reviews.length;
                const finding = await ProductReview.find();
                product.rating = finding.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
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
module.exports = { giveAReview }