const Order = require("../models/ordersModel");
const MyBalance = require("../models/myBalance");
const Notification = require("../models/notificationMdels");
const User = require("../models/userModel");
const BalanceHistory = require("../models/balanceHistoryModel");

const orderAdd = async (req, res, next) => {
	if (!(req?.user?._id)) {
		return res.status(400).json({ error: { status: "user do not exists! please provide valid user credentials!" } })
	}
	const { products, maxDistance,address, transaction_id, tx_ref } = req.body;
	const latitude = req?.body?.location?.latitude || 0;
	const longitude = req?.body?.location?.longitude || 0;
	const address1 = req?.body?.location?.address;
    const houseNumber = req?.body?.location?.houseNumber;
    const floor = req?.body?.location?.floor;
    const information = req?.body?.location?.information;
	const productOwner = [];
	for (let i = 0; i < products.length; i++) {
		productOwner.unshift(products[i]?.productOwner)
	}
	const riderArr = [];
	await User.aggregate().near({
		near: [parseFloat(longitude), parseFloat(latitude)],
		maxDistance: Number(maxDistance) || 100000,
		spherical: true,
		query: { role: 'rider', status: 'approved' },
		distanceField: "dist.calculated"
	}).then(riders => {
		for (let r = 0; r < riders?.length; r++) {
			riderArr.unshift(riders[r]?._id)
		}
	});
	try {
		const created = await Order.create({
			user: req?.user?._id,
			transaction_id,
			tx_ref,
			products,
			location: { latitude, longitude, address: address1 || address, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
		});
		if (!created) {
			return res.status(400).json({ error: { order: "something wrong!" } });
		}
		if (created) {
			const orderCreated = await Order.findOneAndUpdate({ _id: created._id }, {
				currentStatus: 'progress',
				buyerUpdatedStatus: 'progress',
				sellerUpdatedStatus: 'progress',
				riderUpdatedStatus: 'progress',
				adminUpdatedStatus: 'progress',
				$addToSet: { statusUpdatedBy: [req.user._id, ...productOwner, ...riderArr] },
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
				})
			const buyerAmountPay = orderCreated?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)
			for (let i = 0; i < orderCreated?.products.length; i++) {
				const NotificationSendSeller = {
					sender: req?.user?._id,
					product: [{
						productOwner: orderCreated?.products[i]?.productOwner?._id,
						productId: orderCreated?.products[i]?.productId?._id,
						quantity: orderCreated?.products[i]?.quantity,
						price: orderCreated?.products[i]?.price,
					}],
					receiver: [orderCreated?.products[i]?.productOwner?._id],
					message: `You have received New Order From ${orderCreated?.user?.name} Click to view Details order Amount ${"$", orderCreated?.products[i]?.price}`,
				}
				const notificationSending = await Notification.create(NotificationSendSeller);
				//console.log(notificationSending)

			}
			const NotificationSendBuyer = {
				sender: req?.user?._id,
				product: [...products],
				receiver: [req.user._id],
				message: `Thank You For Placing The order. Your Purchase Has Been Confirmed Paid ${"$", buyerAmountPay}.`,
			};
			await Notification.create(NotificationSendBuyer);
			const NotificationSendRider = {
				sender: req?.user?._id,
				product: [...products],
				receiver: [...riderArr],
				message: `You have Recieved New Order From Buyer ${req?.user?.name} order paid amount is ${"$", buyerAmountPay}. Collect order products`,
			};
			await Notification.create(NotificationSendRider);
			return res.status(201).json({ message: "order successfully!", data: orderCreated });
		}

	} catch (error) {
		next(error);
	}
};

const orderSearch = async (req, res, next) => {
	if (!(req?.user?._id)) {
		return res.status(400).json({ error: { status: "user do not exists! please provide valid user credentials!" } })
	}
	let { status, page = 1, limit = 10 } = req.query;
	limit = parseInt(limit);
	try {
		if (status) {
			const order = await Order.find({ user: req?.user?._id, currentStatus: status })
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
				.sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({ user: req?.user?._id, currentStatus: status }).sort({ createdAt: 1, _id: -1 }).count();
			return res.status(200).json({ count, data: order });
		} if (!status) {
			const order = await Order.find({ user: req?.user?._id })
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
				.sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({ user: req?.user?._id }).sort({ createdAt: 1, _id: -1 }).count();
			return res.status(200).json({ count, data: order });
		}

	} catch (error) {
		next(error);
	}
};
const adminSeenOrdersSearch = async (req, res, next) => {
	if (!(req?.user?._id)) {
		return res.status(400).json({ error: { status: "user do not exists! please provide valid user credentials!" } })
	}
	// console.log(req.query)
	if (req?.user?.isAdmin === true) {
		let { status, page = 1, limit = 10 } = req.query;
		// console.log(status)
		const keyword = { currentStatus: status };
		const keyword2 = req.query?.search ? {
			$or: [
				{ name: { $regex: req.query.search?.toLowerCase(), $options: "i" } },
				{ email: { $regex: req.query.search?.toLowerCase(), $options: "i" } },
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
				.sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find(keyword).sort({ createdAt: 1, _id: -1 }).count();
			return res.status(200).json({ count, data: order });
		} catch (error) {
			next(error);
		}
	} else {
		return res.status(400).json({ error: { admin: "admin permission requied!" } });
	}
};

const singleOrder = async (req, res, next) => {
	if (!(req?.user?._id)) {
		return res.status(400).json({ error: { status: "user do not exists! please provide valid user credentials!" } })
	}
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
	if (!(req?.user?._id)) {
		return res.status(400).json({ error: { status: "user do not exists! please provide valid user credentials!" } })
	}
	const statusArr = ['cancelled', 'completed', 'progress', 'delivered'];
	const valided = statusArr.includes(status);
	if (!valided) return res.status(400).json({ error: { status: "please provide valid status credentials!" } })
	try {
		function withdrawTrans(length, id) {
			for (var s = ''; s.length < length; s += `${id}abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01`.charAt(Math.random() * 62 | 0));
			return s;
		}

		const order = await Order.findOne({ _id: req.params.id }).populate({
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
		if (!order) return res.status(400).json({ error: { "order": "order emty" } });
		if (order?.currentStatus === 'cancelled' && status === 'cancelled') {
			return res.status(400).json({ error: { "status": "you have already Cancelled order please update another status!" } })
		}
		if (order?.currentStatus === 'delivered' && status === 'delivered') {

			return res.status(400).json({ error: { "status": "you have already Delivered order please update another status!" } })
		}
		if (order?.currentStatus === 'completed' && status === 'completed') {
			return res.status(400).json({ error: { "status": "you have already Completed order please update another status!" } })
		}
		if (order?.currentStatus === 'progress' && status === 'progress') {
			return res.status(400).json({ error: { "status": "you have already progress order please update another status!" } })
		}
		// console.log(order)
		if (!(req?.user?.isAdmin === true || req?.user?.role === 'rider' || 'seller')) {
			return res.status(400).json({ error: { status: "you can perform only rider and admin permission required!" } })
		}
		// console.log(req.user)
		// console.log(order)
		if (req?.user?.isAdmin === true || req?.user?.role === 'rider' || 'seller') {
			const buyerAmountPay = order?.products?.reduce((perv, curr) => (perv + Number(curr?.price)), 0)
			const productOwnerArr = [];
			for (let i = 0; i < order?.products.length; i++) {
				productOwnerArr.unshift(order?.products[i]?.productOwner)
			}
			const NotificationSendBuyer = {
				sender: req?.user?._id,
				product: [...order?.products],
				receiver: [order?.user?._id],
				message: ` ${req?.user?.name} ${req?.user?.role} Has Deliverd The Order If You Have Recieved The Order Then Please Confirm It. Order amount is ${"$", buyerAmountPay} `,
			}
			const NotificationOrderCancelled = {
				sender: req?.user?._id,
				product: [...order?.products],
				receiver: [order?.user?._id],
				message: `${req?.user?.role} ${req?.user?.name} Mark it Order Delivered failed! Refund Balance. you have received money ${"$", buyerAmountPay} `,
			}

			if (order) {
				//admin approved
				if (order?.currentStatus === 'delivered' && status === 'cancelled') {
					if (req?.user?.role === 'buyer') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							buyerUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.role === 'seller') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							sellerUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.role === 'rider') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							riderUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.isAdmin === 'admin') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							adminUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					const updated = await Order.findOne({ _id: req.params.id }).populate({
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
					for (let i = 0; i < updated?.products.length; i++) {
						const balanceHistory = await BalanceHistory.create({
							amount: updated?.products[i].price,
							trans_pay: "amount_subtract",
							balanceSender: [updated?.user?._id],
							balanceReceiver: [updated?.products[i]?.productOwner?._id],
							status: 'approved',
							transaction_id: withdrawTrans(10, updated?.products[i]?.productOwner?._id)
						})
						const NotificationSendSeller = {
							sender: req?.user?._id,
							product: [{
								productOwner: updated?.products[i]?.productOwner?._id,
								productId: updated?.products[i]?.productId?._id,
								quantity: updated?.products[i]?.quantity,
								price: updated?.products[i]?.price,
							}],
							receiver: [updated?.products[i]?.productOwner?._id],
							message: `${req?.user?.role} ${req?.user?.name} Mark it Order Cancelled: Refund Balance to Buyer account. ${order?.user?.name}  Refund Amount is ${"$", updated?.products[i]?.price}`,
						}
						// console.log(updated)
						await Notification.create(NotificationSendSeller);
						// console.log(notificationSending)
						// console.log(balanceHistory)
						const updateTransaction = await MyBalance.findOneAndUpdate(
							{
								user: updated?.products[i]?.productOwner?._id,
							},
							{ $inc: { balance: -updated?.products[i].price } },
							{ new: true }
						);
					}
					const buyerBalance = await MyBalance.findOneAndUpdate(
						{
							user: updated?.user?._id,
						},
						{ $inc: { balance: buyerAmountPay } },
						{ new: true }
					);
					const balanceHistoryAdd = await BalanceHistory.create({
						amount: buyerAmountPay,
						trans_pay: "amount_added",
						balanceSender: [...productOwnerArr],
						balanceReceiver: [updated?.user?._id],
						status: 'approved',
						transaction_id: withdrawTrans(10, updated?.user?._id)
					})
					await Notification.create(NotificationOrderCancelled);
					return res.status(200).json({ message: `${req?.user?.role} ${req?.user?.name} Mark it Order Cancelled! Automatic Subtract Seller Balance Refund to Buyer Account! ${"$", buyerAmountPay}`, data: updated });
				}
				if (order?.currentStatus === 'cancelled' && status === 'delivered') {
					if (req?.user?.role === 'buyer') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							buyerUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.role === 'seller') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							sellerUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.role === 'rider') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							riderUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					if (req?.user?.isAdmin === 'admin') {
						const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
							adminUpdatedStatus: status,
							currentStatus: status,
							$addToSet: { statusUpdatedBy: [req.user._id] },
						}, { new: true })
					}
					const updated = await Order.findOne({ _id: req.params.id }).populate({
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
					for (let i = 0; i < updated?.products.length; i++) {
						const balanceHistory = await BalanceHistory.create({
							amount: updated?.products[i].price,
							trans_pay: "amount_added",
							balanceSender: [updated?.user?._id],
							balanceReceiver: [updated?.products[i]?.productOwner?._id],
							status: 'approved',
							transaction_id: withdrawTrans(10, updated?.products[i]?.productOwner?._id)
						})
						const NotificationSendSeller = {
							sender: req?.user?._id,
							product: [{
								productOwner: updated?.products[i]?.productOwner?._id,
								productId: updated?.products[i]?.productId?._id,
								quantity: updated?.products[i]?.quantity,
								price: updated?.products[i]?.price,
							}],
							receiver: [updated?.products[i]?.productOwner?._id],
							message: `${req?.user?.role} ${req?.user?.name} Mark it Order Delivered: Refund Balance to seller Account.  Buyer ${order?.user?.name} from Refund Amount is ${"$", updated?.products[i]?.price}`,
						}
						// console.log(updated)
						const balanceHistoryAdd = await BalanceHistory.create({
							amount: updated?.products[i]?.price,
							trans_pay: "amount_subtract",
							balanceSender: [updated?.user?._id],
							balanceReceiver: [updated?.products[i]?.productOwner?._id],
							status: 'approved',
							transaction_id: withdrawTrans(10, updated?.products[i]?.productOwner?._id)
						})
						await Notification.create(NotificationSendSeller);
						// console.log(notificationSending)
						// console.log(balanceHistory)
						const updateTransaction = await MyBalance.findOneAndUpdate(
							{
								user: updated?.products[i]?.productOwner?._id,
							},
							{ $inc: { balance: updated?.products[i].price } },
							{ new: true }
						);
					}
					const buyerBalance = await MyBalance.findOneAndUpdate(
						{
							user: updated?.user?._id,
						},
						{ $inc: { balance: -buyerAmountPay } },
						{ new: true }
					);

					await Notification.create(NotificationOrderCancelled);
					return res.status(200).json({ message: `Order Successfully Delivered ! Automatic added Seller Balance Refund to seller Account! amount is ${"$", buyerAmountPay}`, data: updated });
				}
				if (req?.user?.role === 'buyer') {
					const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
						buyerUpdatedStatus: status,
						currentStatus: status,
						$addToSet: { statusUpdatedBy: [req.user._id] },
					}, { new: true })
				}
				if (req?.user?.role === 'seller') {
					const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
						sellerUpdatedStatus: status,
						currentStatus: status,
						$addToSet: { statusUpdatedBy: [req.user._id] },
					}, { new: true })
				}
				if (req?.user?.role === 'rider') {
					const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
						riderUpdatedStatus: status,
						currentStatus: status,
						$addToSet: { statusUpdatedBy: [req.user._id] },
					}, { new: true })
				}
				if (req?.user?.isAdmin === 'admin') {
					const updatedBuyer = await Order.findOneAndUpdate({ _id: req.params.id }, {
						adminUpdatedStatus: status,
						currentStatus: status,
						$addToSet: { statusUpdatedBy: [req.user._id] },
					}, { new: true })
				}
				const updated = await Order.findOne({ _id: req.params.id }).populate({
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
					if (updated?.currentStatus === 'delivered') {
						for (let i = 0; i < updated?.products.length; i++) {
							const NotificationSendSeller = {
								sender: req?.user?._id,
								product: [{
									productOwner: updated?.products[i]?.productOwner?._id,
									productId: updated?.products[i]?.productId?._id,
									quantity: updated?.products[i]?.quantity,
									price: updated?.products[i]?.price,
								}],
								receiver: [updated?.products[i]?.productOwner?._id],
								message: `${req?.user?.role} ${req?.user?.name} Mark it Delivery as Completed From ${updated?.user?.name} Click to view Details order Amount is ${"$", updated?.products[i]?.price}`,
							}
							const notificationSending = await Notification.create(NotificationSendSeller);
							// console.log(notificationSending)
							//added balance history
							const balanceHistory = await BalanceHistory.create({
								amount: updated?.products[i].price,
								trans_pay: "amount_added",
								balanceSender: [updated?.user?._id],
								balanceReceiver: [updated?.products[i]?.productOwner?._id],
								status: 'approved',
								transaction_id: withdrawTrans(10, updated?.products[i]?.productOwner?._id)
							})
							// console.log(balanceHistory)
							//balance added
							const createdNotification = await Notification.create(NotificationSendSeller);
							const updateTransaction = await MyBalance.findOneAndUpdate(
								{
									user: updated?.products[i].productOwner?._id,
								},
								{ $inc: { balance: updated?.products[i].price } },
								{ new: true }
							);
						}
						await Notification.create(NotificationSendBuyer);
						return res.status(200).json({ message: `Order Successfully Delivered! Automatic Added Seller Balance Transaction Completed! Amount is ${"$", buyerAmountPay}`, data: updated });

					} else {
						for (let i = 0; i < order?.products.length; i++) {
							const NotificationSendSeller = {
								sender: req?.user?._id,
								product: [{
									productOwner: order?.products[i]?.productOwner?._id,
									productId: order?.products[i]?.productId?._id,
									quantity: order?.products[i]?.quantity,
									price: order?.products[i]?.price,
								}],
								receiver: [order?.products[i]?.productOwner?._id],
								message: `${req?.user?.role}  ${req?.user?.name} Mark it ${status} From ${order?.user?.name} Click to view Details order Amount ${"$", order?.products[i]?.price}`,
							}
							const notificationSending = await Notification.create(NotificationSendSeller);
						}
						await Notification.create(NotificationSendBuyer);
						return res.status(200).json({ message: `Order Status  Mark it ${status} From ${order?.user?.name}  Successfully Updated!`, data: updated })
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
	// console.log(req.user)
	try {
		let { status, page = 1, limit = 10 } = req.query;
		limit = parseInt(limit);
		const order = await Order.find({ currentStatus: status }).populate({
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
			}).sort({ createdAt: 1, _id: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);
		const count = await Order.find({ currentStatus: status }).populate({
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
		let { status, page = 1, limit = 10 } = req.query;
		limit = parseInt(limit);
		if (req?.user?.isAdmin === true) {
			if (status) {
				const order = await Order.find({ currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 })
					.limit(limit * 1)
					.skip((page - 1) * limit);
				const count = await Order.find({ currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 }).count();
				if (!order) {
					return res.status(404).json({ error: [] })
				} if (order) {
					return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
				}
			}
			const order = await Order.find({}).populate({
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
				}).sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({}).populate({
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
				}).sort({ createdAt: 1, _id: -1 }).count();
			if (!order) {
				return res.status(404).json({ error: [] })
			} if (order) {
				return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
			}

		}
		//admin end status
		if (req?.user?.role === 'rider') {
			if (status) {
				const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 })
					.limit(limit * 1)
					.skip((page - 1) * limit);
				const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 }).count();
				if (!order) {
					return res.status(404).json({ error: [] })
				} if (order) {
					return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
				}
			}
			const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 }).count();
			if (!order) {
				return res.status(404).json({ error: [] })
			} if (order) {
				return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
			}

		}
		if (req?.user?.role === 'seller') {
			if (status) {
				const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 })
					.limit(limit * 1)
					.skip((page - 1) * limit);
				const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 }).count();
				if (!order) {
					return res.status(404).json({ error: [] })
				} if (order) {
					return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
				}
			}

			const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 }).count();
			if (!order) {
				return res.status(404).json({ error: [] })
			} if (order) {
				return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
			}

		}
		if (req?.user?.role === 'buyer') {

			if (status) {
				const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 })
					.limit(limit * 1)
					.skip((page - 1) * limit);
				const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: status }).populate({
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
					}).sort({ createdAt: 1, _id: -1 }).count();
				if (!order) {
					return res.status(404).json({ error: [] })
				} if (order) {
					return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
				}
			}
			const order = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit);
			const count = await Order.find({ statusUpdatedBy: req.user._id, currentStatus: "progress" }).populate({
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
				}).sort({ createdAt: 1, _id: -1 }).count();
			if (!order) {
				return res.status(404).json({ error: [] })
			} if (order) {
				return res.status(200).json({ message: "your order updated history successfully fetch!", count, data: order })
			}
		}

	}
	catch (error) {
		next(error)
	}
}

module.exports = { orderAdd, allStatusOrder, orderStatusUpdate, orderSearch, singleOrder, adminSeenOrdersSearch, orderStatusUpdatedMyHistory };