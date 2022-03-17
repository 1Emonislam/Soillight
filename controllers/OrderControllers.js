const Order = require("../models/ordersModel");
const MyBalance = require("../models/myBalance");
const Notification = require("../models/notificationMdels");
const User = require("../models/userModel");
const orderAdd = async (req, res, next) => {
	const { products, transaction_id, tx_ref } = req.body;
	const { latitude, longitude } = req?.body?.location;
	const buyer = await User.findOne({ _id: req.user._id });
	try {
		const role = req?.user?.isAdmin === true ? 'admin' : req?.user?.role;
		const created = await Order.create({
			user: req.user._id,
			transaction_id,
			tx_ref,
			products,
			userType: role,
			location: { latitude, longitude }
		});
		if (!created) {
			return res.status(400).json({ error: { order: "something wrong!" } });
		}
		if (created) {
			let productOwnerNotify = [];
			for (let owner = 0; owner < products.length; owner++) {
				productOwnerNotify.unshift(products[owner].productOwner);
			}
			const NotificationSendSeller = {
				sender: req.user._id,
				product: [...products],
				receiver: [...productOwnerNotify],
				message: `You Have Received New Order From ${buyer.name}`,
			};
			await Notification.create(NotificationSendSeller);
			const NotificationSendBuyer = {
				sender: req.user._id,
				product: [...products],
				receiver: [req.user._id],
				message: `Congratulations! your order has been placed successfully!`,
			};
			await Notification.create(NotificationSendBuyer);
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
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			})
			.sort([['date', -1]])
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const count = await Order.find({ user: req.user._id, status: status }).sort([['date', -1]]).count();
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
				.sort([['date', -1]])
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find(keyword).sort([['date', -1]]).count();
			return res.status(200).json({ count, data: order });
		} catch (error) {
			next(error);
		}
	} else {
		return res.status(400).json({ error: { admin: "admin permission requied!" } });
	}
};

const singleOrder = async (req, res, next) => {
	if (req?.user?.isAdmin === true) {
		const order = await Order.findOne({ _id: req.params.id })
			.populate({
				path: "user",
				select: "_id name address phone email pic",
			})
			.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			});
		return res.status(200).json({ data: order });
	} else {
		return res.status(400).json({ error: { admin: "admin permission required!" } });
	}
};

const orderStatusUpdate = async (req, res, next) => {
	let { status } = req.body;
	// console.log(req.user)
	const statusArr = ['pending', 'approved', 'cancelled', 'completed', 'shipped', 'progress', 'delivered'];
	const valided = statusArr.includes(status);
	if (!valided) return res.status(400).json({ error: { status: "please provide valid status credentials!" } })
	try {
		const order = await Order.findOne({ _id: req.params.id });
		if (!order) return res.status(400).json({ error: { "order": "order emty" } });
		if (order?.status === 'cancelled' && status === 'cancelled') {
			return res.status(400).json({ error: { "status": "you have already Cancelled order please update another status!" } })
		}
		if (order?.status === 'delivered' &&  status === 'delivered') {
			return res.status(400).json({ error: { "status": "you have already Delivered order please update another status!" } })
		}
		if (order?.status === 'completed' && status === 'completed') {
			return res.status(400).json({ error: { "status": "you have already Completed order please update another status!" } })
		}
		if (order?.status === 'pending' &&  status === 'pending') {
			return res.status(400).json({ error: { "status": "you have already Pending order please update another status!" } })
		}
		if (order?.status === 'approved' && status === 'approved') {
			return res.status(400).json({ error: { "status": "you have already Approved order please update another status!" } })
		}
		if (order?.status === 'shipped' && status === 'shipped') {
			return res.status(400).json({ error: { "status": "you have already Shipped order please update another status!" } })
		}
		if (order?.status === 'progress' && status === 'progress') {
			return res.status(400).json({ error: { "status": "you have already progress order please update another status!" } })
		}
		// console.log(order)
		if (!(req?.user?.isAdmin === true || req?.user?.role === 'buyer')) {
			return res.status(400).json({ error: { status: "you can perform only rider and admin permission required!" } })
		}
		if (req?.user?.role === 'rider' || req?.user?.isAdmin === true) {
			if (order) {
				let productOwnerNotify = [];
				for (let owner = 0; owner < order?.products.length; owner++) {
					productOwnerNotify.unshift(order?.products[owner].productOwner)
				}
				const roleBy = req?.user?.isAdmin === true ? 'admin' : req?.user?.role;
				const updated = await Order.findOneAndUpdate({ _id: req.params.id }, {
					status: status,
					userType: roleBy,
					statusUpdatedBy: req.user._id,
				}, { new: true }).populate({
					path: "user",
					select: "_id name address phone email pic",
				})
					.populate("products.productId", "_id name img pack_type serving_size numReviews rating")
					.populate({
						path: "products.productOwner",
						select: "_id name address phone email sellerShop pic",
						populate: [
							{
								path: "sellerShop",
								select: "_id address location name",
							},
						],
					});
				if (updated) {
					if (updated?.status === 'cancelled' || updated?.status === 'delivered') {
						if (updated?.status === 'delivered') {
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
							const NotificationSendSeller = {
								sender: req.user._id,
								product: [...order?.products],
								receiver: [...productOwnerNotify],
								message: `Congratulations! Your product has been delivered! Balance added Transaction Complete. ${order?.user?.name}`,
							}
							await Notification.create(NotificationSendSeller);

							return res.status(200).json({ message: "Order Successfully Delivered! Automatic Added Seller Balance Transaction Completed!", data: updated });
						}
						if (updated?.status === 'cancelled') {
							const buyerAmountPay = order?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)
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
								const buyerBalance = await MyBalance.findOneAndUpdate(
									{
										user: order?.user,
									},
									{ $inc: { balance: buyerAmountPay } },
									{ new: true }
								);
							}

							const NotificationSendSeller = {
								sender: req.user._id,
								product: [...order?.products],
								receiver: [...productOwnerNotify],
								message: `Order Cancelled: Refund Balance to Buyer account. If you have any problems with your account balance, please contact customer support. Buyer ${updated?.user?.name}`,
							}
							const NotificationSendBuyer = {
								sender: req.user._id,
								product: [...order?.products],
								receiver: [order?.user],
								message: `Order Delivered failed! Refund Balance. you have received money $${buyerAmountPay} `,
							}
							await Notification.create(NotificationSendSeller);
							await Notification.create(NotificationSendBuyer);
							return res.status(200).json({ message: "Order Successfully Cancelled ! Automatic Subtract Seller Balance Refund to Buyer Account!", data: updated });
						}
					} else {
						let productOwnerNotify = [];
						for (let owner = 0; owner < order?.products.length; owner++) {
							productOwnerNotify.unshift(order?.products[owner].productOwner)
						}
						const NotificationSendSeller = {
							sender: req.user._id,
							product: [...order?.products],
							receiver: [...productOwnerNotify],
							message: `order status ${status}`,
						}
						const NotificationSendBuyer = {
							sender: req.user._id,
							product: [...order?.products],
							receiver: [order?.user],
							message: `your order status is ${status}`,
						}
						await Notification.create(NotificationSendBuyer);
						await Notification.create(NotificationSendSeller);
						return res.status(200).json({ message: "Order Status Successfully Updated!", data: updated })
					}
				}
			}
		}
	}
	catch (error) {
		next(error)
	}
}

const allStatusOrder = async (req, res, next) => {
	try {
		let { status, page = 1, limit = 10 } = req.query;
		limit = parseInt(limit);
		const order = await Order.find({ status: status }).populate({
			path: "user",
			select: "_id name address phone email pic",
		}).populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			}).sort([['date', -1]])
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const count = await Order.find({ status: status }).populate({
			path: "user",
			select: "_id name address phone email pic",
		}).populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			}).count();
		return res.status(200).json({ count, data: order })
	}
	catch (error) {
		next(error)
	}
}

const orderStatusUpdatedMyHistory = async (req, res, next) => {
	try {
		let { page = 1, limit = 10 } = req.query;
		limit = parseInt(limit);
		const order = await Order.find({ statusUpdatedBy: req.user._id }).populate({
			path: "user",
			select: "_id name address phone email pic",
		}).populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			}).sort([['date', -1]])
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const count = await Order.find({ statusUpdatedBy: req.user._id }).populate({
			path: "user",
			select: "_id name address phone email pic",
		}).populate("products.productId", "_id name img pack_type serving_size numReviews rating")
			.populate({
				path: "products.productOwner",
				select: "_id name address phone email sellerShop pic",
				populate: [
					{
						path: "sellerShop",
						select: "_id address location name",
					},
				],
			}).sort([['date', -1]]).count();
		if (!order) {
			return res.status(404).json({ error: [] })
		} if (order) {
			return res.status(200).json({ message: "your updated history successfully fetch!", count, data: order })
		}
	}
	catch (error) {
		next(error)
	}
}


module.exports = { orderAdd, allStatusOrder, orderStatusUpdate, orderSearch, singleOrder, adminSeenOrdersSearch, orderStatusUpdatedMyHistory };