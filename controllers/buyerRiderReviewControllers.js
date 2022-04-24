const { BuyerReviews } = require("../models/buyerRiderReviewsModel");
const User = require("../models/userModel");

const giveAReviewBuyer = async (req, res, next) => {
    const { rating, comment } = req.body;
    // console.log(Number(rating))
    const user = await User.findOne({ _id: req?.params?.id });
    if (Number(rating) >= 6 || Number(rating) === 0) {
        return res.status(404).json({ error: { "rating": `Review failed! Please enter a minimum of 1 to a maximum of 5` } })
    }
    try {
        //console.log(product)
        if (user) {
            const buyerReviewed = await BuyerReviews.findOne({ reviewSender: req?.user?._id })
            if (buyerReviewed) {
                return res.status(400).json({ error: { "buyer": "Buyer already reviewed!" } })
            } else {
                const review = {
                    role: req?.user?.role,
                    rating: Number(rating),
                    comment,
                    reviewSender: req?.user?._id,
                    reviewReceiver: req?.params?.id
                }
                const reviewAdded = await BuyerReviews.create(review);
                const finding = await BuyerReviews.find({ reviewReceiver: req.params.id });
                buyerReviewed.numReviews = finding?.length;
                buyerReviewed.rating = finding.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
                await buyerReviewed.save();
                return res.status(201).json({ message: 'Review added' });
            }
        } else {
            return res.status(404).json({ error: { "buyer": "Buyer review failed!" } })
        }
    }
    catch (error) {
        next(error)
    }
}

const reviewUpdateBuyerSellerRider = async (req, res, next) => {
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
            return res.status(404).json({ error: { "product": "Product not founds!" }, data: [] })
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = { giveAReviewBuyerSellerRider, reviewUpdateBuyerSellerRider }