const Order = require("../models/ordersModel");
const MyBalance = require("../models/myBalance");
const Notification = require("../models/notificationMdels");
const User = require("../models/userModel");
const orderAdd = async (req, res, next) => {
	const { products, transaction_id, tx_ref } = req.body;
	const buyer = await User.findOne({ _id: req.user._id });
	try {
		const created = await Order.create({
			user: req.user._id,
			transaction_id,
			tx_ref,
			products,
		});
		if (!created) {
			return res.status(400).json({ error: { order: "something wrong!" } });
		}
		if (created) {
			let productOwnerNotify = [];
			for (let owner = 0; owner < products.length; owner++) {
				productOwnerNotify.unshift(products[owner].productOwner);
			}
			const NotificationSendObj = {
				sender: req.user._id,
				product: [...products],
				receiver: [...productOwnerNotify],
				message: `You Have Received New Order From ${buyer.name}`,
			};
			await Notification.create(NotificationSendObj);
		}
		return res.status(200).json({ message: "order successfully!", data: created });
	} catch (error) {
		next(error);
	}
};

const orderSearch = async (req, res, next) => {
	let { status, page = 1, limit = 10 } = req.query;
	limit = parseInt(limit);
	try {
		const order = await Order.find({ user: req.user._id, status: status })
			.populate({
				path: "user",
				select: "_id name address phone email pic",
			})
			.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop",
				populate: [
					{
						path: "sellerShop",
						select: "_id address",
					},
				],
			})
			.sort({ createdAt: -1, _id: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const count = await Order.find({ user: req.user._id, status: status }).sort({ createdAt: -1, _id: -1 }).count();
		return res.status(200).json({ count, data: order });
	} catch (error) {
		next(error);
	}
};
const adminSeenOrdersSearch = async (req, res, next) => {
	// console.log(req.query)
	if (req?.user?.isAdmin === true) {
		let { status, page = 1, limit = 10 } = req.query;
		// console.log(status)
		const keyword = { status: status };
		const keyword2 = req.query?.search ? {
			$or: [
				{ name: { $regex: req.query.search?.toLowerCase(), $options: "i" } },
				{ email: { $regex: req.query.search?.toLowerCase(), $options: "i" }, },
			],
		} : {};
		limit = parseInt(limit);
		try {
			const order = await Order.find(keyword)
				.populate({
					path: 'user',
					match: keyword2,
					select: "_id name email pic"
				})
				.populate({
					path: "products.productOwner",
					select: "_id name email pic"
				})
				.sort({ createdAt: -1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find(keyword).sort({ createdAt: -1, _id: -1 }).count();
			return res.status(200).json({ count, data: order });
		} catch (error) {
			next(error);
		}
	} else {
		return res.status(400).json({ error: { admin: "admin permission requied!" } });
	}
};
const orderGet = async (req, res, next) => {
	try {
		const result = await Order.find().populate({
			path: "products",
			populate: {
				path: "products.productId",
			},
		});
		res.json({ result });
	} catch (error) {
		next(error);
	}
};

const singleOrder = async (req, res, next) => {
	if (req?.user?.isAdmin === true) {
		const order = await Order.findOne({ _id: req.params.id })
			.populate({
				path: "user",
				select: "_id name address phone email",
			})
			.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop",
				populate: [
					{
						path: "sellerShop",
						select: "_id address",
					},
				],
			});
		return res.status(200).json({ data: order });
	} else {
		return res.status(400).json({ error: { admin: "admin permission required!" } });
	}
};

const orderCompeleteToBlanceAdd = async (req, res, next) => {
	// console.log(req.user)
	try {
		const permission = MyBalance.findOne({ user: req.user._id });
		if (!(req?.user?.isAdmin === true && permission)) {
			return res.status(401).json({ error: { admin: "admin permission required!" } });
		}
		if (req?.user?.isAdmin === true && permission) {
			const order = await Order.findOne({ _id: req?.params?.id })
				.populate({
					path: "user",
					select: "_id name address phone email",
				})
				.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
				.populate({
					path: "products.productOwner",
					select: "_id name address phone email sellerShop",
					populate: [
						{
							path: "sellerShop",
							select: "_id address",
						},
					],
				});
			// console.log(order)
			if (!order) {
				return res.status(404).json({ error: { order: "order not founds please provide valid order credentials" } });
			}
			for (let i = 0; i < order?.products.length; i++) {
				let updatedBalance;
				updatedBalance = order?.products[i].price;
				//console.log(updatedBalance)
				const updateTransaction = await MyBalance.findOneAndUpdate(
					{
						user: order?.products[i].productOwner,
					},
					{ $inc: { balance: updatedBalance } },
					{ new: true }
				);
			}
			let productOwnerNotify = [];
			for (let owner = 0; owner < order?.products.length; owner++) {
				productOwnerNotify.unshift(order?.products[owner].productOwner)
			}
			const NotificationSendObj = {
				sender: req.user._id,
				product: [...order?.products],
				receiver: [...productOwnerNotify],
				message:`Congratulations! Your product has been delivered! Balance added Transaction Complete. ${order?.name}`,
			}
			await Notification.create(NotificationSendObj);
			order.status = "complete";
			await order.save();
			return res.status(200).json({ message: "order Successfully Completed! automatic added seller balance Transaction Complete!", data: order });
		}
	} catch (error) {
		next(error);
	}
};

const orderCancelToBalanceSub = async (req, res, next) => {
	try {
		const permission = MyBalance.findOne({ user: req.user._id });
		if (!(req?.user?.isAdmin === true && permission)) {
			return res.status(401).json({ error: { admin: "admin permission required!" } });
		}
		if (req?.user?.isAdmin === true && permission) {
			const order = await Order.findOne({ _id: req?.params?.id })
				.populate({
					path: "user",
					select: "_id name address phone email",
				})
				.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
				.populate({
					path: "products.productOwner",
					select: "_id name address phone email sellerShop",
					populate: [
						{
							path: "sellerShop",
							select: "_id address",
						},
					],
				});
			// console.log(order)
			if (!order) {
				return res.status(404).json({ error: { order: "order not founds please provide valid order credentials" } });
			}
			for (let i = 0; i < order?.products.length; i++) {
				let updatedBalance;
				updatedBalance = order?.products[i].price;
				//console.log(updatedBalance)
				const updateTransaction = await MyBalance.findOneAndUpdate(
					{
						user: order?.products[i].productOwner,
					},
					{ $inc: { balance: -updatedBalance } },
					{ new: true }
				);
			}
			let productOwnerNotify = [];
			for (let owner = 0; owner < order?.products.length; owner++) {
				productOwnerNotify.unshift(order?.products[owner].productOwner)
			}
			const NotificationSendObj = {
				sender: req.user._id,
				product: [...order?.products],
				receiver: [...productOwnerNotify],
				message: `Cancelled Order: Refund Balance to Buyer account. If you have any problems with your account balance, please contact customer support. ${order?.name}`,
			}
			await Notification.create(NotificationSendObj);
			order.status = "cancel";
			await order.save();
			return res.status(200).json({ message: "order Successfully Cancel! automatic subtract seller balance Transaction Complete!", data: order });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { orderAdd, orderGet, orderSearch, singleOrder, orderCompeleteToBlanceAdd, orderCancelToBalanceSub, adminSeenOrdersSearch };