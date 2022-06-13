const User = require('../models/userModel');
const ProductReview = require('../models/productReviewModel');
const MyBlance = require('../models/myBalance');
const Notification = require('../models/notificationMdels');
const { genToken } = require('../utils/genToken');
const { sendOtpVia, verifyOtp } = require('../utils/otp');
const MyBalance = require('../models/myBalance');
const { upload } = require('../utils/file');


const singleUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const finding = await ProductReview.find({ user: id });
        let totalRate = finding?.length;
        let avgRating = finding?.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
        const user = await User.findOne({ _id: id }).populate("sellerShop", "-user");
        return res.status(200).json({ totalRate, avgRating, data: user })
    }
    catch (error) {
        next(error)
    }
}
const resendOtp = async (req, res, next) => {
    try {
        if (!(req?.user?.phone)) {
            return res.status(400).json({ error: { phone: 'Resend otp sending Phone Number is Required' } })
        }
        if (req?.user?.phone) {
            const send = await sendOtpVia(req?.user?.phone);
            // console.log(send)
            if (send?.sent === false) {
                return res.status(400).json({ error: { "phone": "Resend Otp Sending failed! Please try again!" }, token: genToken(req?.user?._id), error: { otp: send?.issue, sent: false } })
            } if (send?.sent === true) {
                return res.status(200).json({ message: "Resend Otp Sending Successfully!", token: genToken(req?.user?._id), sent: true })
            }
        }
    }
    catch (error) {
        next(error)
    }
}
const login = async (req, res, next) => {
    let { email, phone, password, role } = req.body;
    if(!phone.startsWith('+')){
        phone = '+' +phone;
    }
    email?.toLowerCase();
    const user = await User.findOne({ phone }) || await User.findOne({ email });
    // console.log(user)
    try {
        if (!user) {
            return res.status(400).json({ error: { "email": "Could not find user" } })
        }
        if (user?.phoneVerified === false) {
            const send = await sendOtpVia(user?.phone);
            // console.log(send)
            const data = await User.findOneAndUpdate({ _id: user._id }, {
                role: role
            }, { new: true });
            if (send?.sent === false) {
                return res.status(400).json({ message: `Switch Mode ${data?.role}`, role: data?.role, token: genToken(data?._id), error: { otp: send?.issue, sent: false } })
            }
            if (send?.sent === true) {
                return res.status(200).json({ message: `Switch Mode ${data?.role}`, role: data?.role, token: genToken(user?._id), sent: true })
            }
        }
        if (!(user && (await user.matchPassword(password)))) {
            return res.status(400).json({ error: { "password": "Password invalid! please provide valid password!" } });
        } else if (user && (await user.matchPassword(password))) {
            if (role) {
                if (role === 'buyer') {
                    const data = await User.findOneAndUpdate({ _id: user._id }, {
                        role: role
                    }, { new: true }).select("-password").select("-adminShop").select("-sellerShop")
                    return res.status(200).json({ message: "Switch Mode Buyer", role: data?.role, data: data, token: genToken(data?._id) })
                }
                if (role === 'seller') {
                    const data = await User.findOneAndUpdate({ _id: user._id }, {
                        role: role
                    }, { new: true }).select("-password").select("-adminShop")
                    return res.status(200).json({ message: "Switch Mode Seller", role: data?.role, data: data, token: genToken(data?._id) })
                }
                if (role === 'rider') {
                    const data = await User.findOneAndUpdate({ _id: user._id }, {
                        role: role
                    }, { new: true }).select("-password").select("-adminShop").select("-sellerShop")
                    return res.status(200).json({ message: "Switch Mode Rider", role: data?.role, data: data, token: genToken(data?._id) })
                }
                if (req?.user?.isAdmin === true) {
                    const data = await User.findOneAndUpdate({ _id: user._id }, {
                        role: role
                    }, { new: true }).select("-password").select("-sellerShop")
                    return res.status(200).json({ message: "Switch Mode Admin", role: data?.role, data: data, token: genToken(data?._id) })
                }
            }
            const userExists = await User.findOne({ _id: user?._id }).select("-password");
            return res.status(200).json({ message: "Login Successfully!", data: userExists, token: genToken(userExists._id) });
        }
    }
    catch (error) {
        next(error)
    }
}

const registrationBuyer = async (req, res, next) => {
    let { name, phone, email, password, address } = req.body;
    if(!phone.startsWith('+')){
        phone = '+' +phone;
    }
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    const address1 = req?.body?.location?.address;
    const houseNumber = req?.body?.location?.houseNumber;
    const floor = req?.body?.location?.floor;
    const information = req?.body?.location?.information;
    email?.toLowerCase();
    function validatePhone(elementValue) {
        const re = /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/
        return re.test(elementValue);
    }

    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    function checkPassword(password) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
    if (!(checkPassword(password))) {
        return res.status(400).json({ error: { password: "password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if ((userExist?.phoneVerified || phoneExist?.phoneVerified) === false) {
        const send = await sendOtpVia(userExist?.phone || phoneExist?.phone);
        // console.log(send)
        if (send?.sent === false) {
            return res.status(400).json({ token: genToken(userExist?._id || phoneExist?._id), error: { otp: send?.issue, sent: false } })
        }
        if (send?.sent === true) {
            return res.status(200).json({ token: genToken(userExist?._id || phoneExist?._id), sent: true })
        }
    }
    if (userExist) {
        return res.status(302).json({ error: { "email": "Email Already exists!" } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "phone": "This phone number is linked to another account, please enter another number." } })
    }
    try {
        const created = await User.create({ name, phone, email, role: 'buyer', location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, password, address })
        if (!created) {
            return res.status(400).json({ error: { "email": "Buyer Registration failed!" } });
        }
        if (created) {
            const balance = await MyBalance.create({
                user: created._id,
            })
            if (balance) {
                created.my_balance = balance._id;
                await created.save();
            }
            const send = await sendOtpVia(created?.phone);
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            if (send?.sent === false) {
                return res.status(400).json({ error: { "phone": "Verify Your Phone Number. Otp Sending failed! Please try again!", token: genToken(created._id) }, error: { otp: send?.issue, sent: false } })
            }
            if (send?.sent === true) {
                return res.status(200).json({ message: "Verify Your Phone Number. Otp Sending Successfully!", data: userRes, token: genToken(created._id), sent: true })
            }
        }
    }
    catch (error) {
        next(error)
    }

}
const registrationSeller = async (req, res, next) => {
    let { name, phone, email, password, address } = req.body;
    if(!phone.startsWith('+')){
        phone = '+' +phone;
    }
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    const address1 = req?.body?.location?.address;
    const houseNumber = req?.body?.location?.houseNumber;
    const floor = req?.body?.location?.floor;
    const information = req?.body?.location?.information;
    function validatePhone(elementValue) {
        const re = /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/
        return re.test(elementValue);
    }

    email = email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    function checkPassword(password) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
    if (!(checkPassword(password))) {
        return res.status(400).json({ error: { password: "password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if ((userExist?.phoneVerified || phoneExist?.phoneVerified) === false) {
        // console.log(userExist?.phone || phoneExist?.phone)
        const send = await sendOtpVia(userExist?.phone || phoneExist?.phone);
        // console.log(send)
        if (send?.sent === false) {
            return res.status(400).json({ token: genToken(userExist?._id || phoneExist?._id), error: { otp: send?.issue, sent: false } })
        }
        if (send?.sent === true) {
            return res.status(200).json({ token: genToken(userExist?._id || phoneExist?._id), sent: true })
        }
    }
    if (userExist) {
        return res.status(302).json({ error: { "email": "Email Already exists! " } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "phone": "This phone number is linked to another account, please enter another number." } })
    }
    if (!address) {
        return res.json({ error: { address: "Please fillup the Address!" } })
    }
    try {
        const created = await User.create({ name, phone, email, role: 'seller', location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, password, address });

        if (!created) {
            return res.status(400).json({ error: { "email": "Seller Registration failed!" } });
        }
        if (created) {
            const balance = await MyBlance.create({
                user: created._id,
            })
            created.my_balance = balance._id;
            await created.save();
            const send = await sendOtpVia(created?.phone);
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            if (send?.sent === false) {
                return res.status(400).json({ error: { "phone": "Verify Your Phone Number. Otp Sending failed! Please try again!", token: genToken(created._id) }, error: { otp: send?.issue, sent: false } })
            }
            if (send?.sent === true) {
                return res.status(200).json({ message: "Verify Your Phone Number. Otp Sending Successfully!", data: userRes, token: genToken(created._id), sent: true })
            }
        }
    }
    catch (error) {
        next(error)
    }

}

const registrationRider = async (req, res, next) => {
    let { name, email, phone, password, address } = req.body;
    if(!phone.startsWith('+')){
        phone = '+' +phone;
        
    }
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    const address1 = req?.body?.location?.address;
    const houseNumber = req?.body?.location?.houseNumber;
    const floor = req?.body?.location?.floor;
    const information = req?.body?.location?.information;
    let verify_id = req?.body?.valid_id?.verify_id;
    let back_side_id = req?.body?.valid_id?.back_side_id;
    let front_side_id = req?.body?.valid_id?.front_side_id;
    let verify_card = req?.body?.license_card?.verify_card;
    let back_side_card = req?.body?.license_card?.back_side_card;
    let front_side_card = req?.body?.license_card?.front_side_card;
    let id1 = req?.body?.valid_id?.id;
    let id2 = req?.body?.license_card?.id;
    function validatePhone(elementValue) {
        const re = /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/
        return re.test(elementValue);
    }

    email = email?.toLowerCase();
    function validateEmail(elementValue) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue);
    }
    if (!(validateEmail(email))) {
        return res.status(400).json({ error: { email: "Email Invalid! Please provide a valid Email!" } })
    }
    function checkPassword(password) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
    if (!(checkPassword(password))) {
        return res.status(400).json({ error: { password: "password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
    }
    const userExist = await User.findOne({ email });
    const phoneExist = await User.findOne({ phone });
    if ((userExist?.phoneVerified || phoneExist?.phoneVerified) === false) {
        const send = await sendOtpVia(userExist?.phone || phoneExist?.phone);
        // console.log(send)
        if (send?.sent === false) {
            return res.status(400).json({ token: genToken(userExist?._id || phoneExist?._id), error: { otp: send?.issue, sent: false } })
        }
        if (send?.sent === true) {
            return res.status(200).json({ token: genToken(userExist?._id || phoneExist?._id), sent: true })
        }
    }
    if (userExist) {
        return res.status(302).json({ error: { "email": "Email Already exists! " } })
    }
    if (phoneExist) {
        return res.status(302).json({ error: { "phone": "This phone number is linked to another account, please enter another number." } })
    }
    if (!address) {
        return res.json({ error: { address: "Please fillup the Address!" } })
    }
    if (!front_side_id) {
        return res.json({ error: { "front_side_id": "Please fillup the valided front side ID!" } });
    }
    if (!back_side_id) {
        return res.json({ error: { "back_side_id": "Please fillup the valided back side ID!" } });
    }
    if (!front_side_card) {
        return res.json({ error: { "back_side_card": "Please fillup the license card valided front side!" } });
    }
    if (!back_side_card) {
        return res.json({ error: { "back_side_id": "Please fillup the license card  valided back side!" } });
    }
    try {
        const created = await User.create({ name, email, role: 'rider', phone, location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, password, address, valid_id: { verify_id, back_side_id, front_side_id, id: id1 }, license_card: { verify_card, id: id2, back_side_card, front_side_card } });
        if (!created) {
            return res.status(400).json({ error: { "email": "Rider Registration failed!" } });
        }
        if (created) {
            const balance = await MyBlance.create({
                user: created._id,
            })
            created.my_balance = balance._id;
            await created.save();
            const send = await sendOtpVia(created?.phone);
            const userRes = await User.findOne({ _id: created._id }).select("-password");
            if (send?.sent === false) {
                return res.status(400).json({ error: { "phone": "Verify Your Phone Number. Otp Sending failed! Please try again!", token: genToken(created._id) }, error: { otp: send?.issue, sent: false } })
            }
            if (send?.sent === true) {
                return res.status(200).json({ message: "Verify Your Phone Number. Otp Sending Successfully!", data: userRes, token: genToken(created._id), sent: true })
            }
        }
    } catch (error) {
        next(error)
    }
}
const profileUpdate = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    // console.log(req.body)
    let { name, role, pic, address } = req.body;
    if (req?.body?.pic) {
        const url = await upload(req?.body?.pic);
        img = url.url;
    }
    const latitude = req?.body?.location?.latitude || 0;
    const longitude = req?.body?.location?.longitude || 0;
    const address1 = req?.body?.location?.address;
    const houseNumber = req?.body?.location?.houseNumber;
    const floor = req?.body?.location?.floor;
    const information = req?.body?.location?.information;
    // console.log(latitude,longitude)
    let verify_id = req?.body?.valid_id?.verify_id;
    let back_side_id = req?.body?.valid_id?.back_side_id;
    let front_side_id = req?.body?.valid_id?.front_side_id;
    let verify_card = req?.body?.license_card?.verify_card;
    let back_side_card = req?.body?.license_card?.back_side_card;
    let front_side_card = req?.body?.license_card?.front_side_card;
    let id1 = req?.body?.valid_id?.id;
    let id2 = req?.body?.license_card?.id;
    try {
        if (!(req?.user?.isAdmin === true || (req?.user?.role === 'seller' || 'buyer' || 'rider' || 'admin'))) {
            return res.status(400).json({ error: { "role": "profile update permission denied! please switch to another role!" } })
        }
        if (req?.user?.role === 'buyer') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                name, role: role || req.user.role, pic, address, location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
            }, { new: true });
            if (!updatedCheck) {
                return res.status(304).json({ error: { email: "Buyer profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop").select("-sellerShop")
                return res.status(200).json({ message: "Buyer profile updated successfully!", data: resData, token: genToken(updatedCheck._id) })
            }
        }
        if (req?.user?.role === 'seller') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                name, role: role || req.user.role, pic, address, location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] },
            }, { new: true });
            if (!updatedCheck) {
                return res.status(304).json({ error: { email: "Seller profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop")
                return res.status(200).json({ message: "Seller profile updated successfully!", data: resData, token: genToken(resData._id) })
            }
        }
        if (req?.user?.role === 'rider') {
            const updatedCheck = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                name, role: role || req.user.role, pic, location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, address, valid_id: { id: id1, verify_id, back_side_id, front_side_id }, license_card: { id: id2, verify_card, back_side_card, front_side_card }
            }, { new: true });
            if (!updatedCheck) {
                return res.status(304).json({ error: { email: "Rider profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop").select("-sellerShop")
                return res.status(200).json({ message: "Rider profile updated successfully!", data: resData, token: genToken(resData._id) })
            }
        }
        if (req?.user?.isAdmin === true) {
            const updatedCheck = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                name, role: 'admin', pic, address, location: { latitude, longitude, address: address1, houseNumber, floor, information }, geometry: { type: "Point", "coordinates": [Number(longitude), Number(latitude)] }, valid_id: { id: id1, verify_id, back_side_id, front_side_id }, license_card: { id: id2, verify_card, back_side_card, front_side_card }
            }, { new: true });
            if (!updatedCheck) {
                return res.status(304).json({ error: { email: "Rider profile update failed!" } })
            } if (updatedCheck) {
                const resData = await User.findOne({ _id: req?.user?._id }).select("-password").select("-sellerShop")
                return res.status(200).json({ message: "Admin profile updated successfully!", data: resData, token: genToken(resData._id) })
            }
        }
    } catch (error) {
        next(error)
    }
}

const userApproved = async (req, res, next) => {
    // console.log(req.user.isAdmin)
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    const { id } = req.params;
    try {
        if (!(req?.user?.isAdmin === true)) {
            if (req?.user?.role === 'buyer') {
                return res.status(400).json({ error: { "email": "Buyer permission denied! only perform Admin!" } })
            }
            if (req?.user?.role === 'rider') {
                return res.status(400).json({ error: { "email": "Rider permission denied! only perform Admin!" } })
            }
            if (req?.user?.role === 'seller') {
                return res.status(400).json({ error: { "email": "Seller permission denied! only perform Admin!" } })
            }
        }
        if (req?.user?.isAdmin === true) {
            const data = await User.findOne({ _id: id }).populate("sellerShop").select("-password");
            if (!data) {
                return res.status({ error: "not found!", data: [] })
            }
            data.status = 'approved';
            await data.save();
            const sendNotification = {
                sender: req?.user?._id,
                receiver: [data._id],
                message: `Congratulations ${data.name} Registration Approved!`
            }
            await Notification.create(sendNotification)
            const finding = await ProductReview.find({ user: id });
            let totalRate = finding?.length;
            let avgRating = finding?.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
            const user = await User.findOne({ _id: id }).populate("sellerShop", "-user");
            return res.status(200).json({ totalRate, avgRating, data: user })

        }
    }
    catch (error) {
        next(error)
    }
}
const userRejected = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    const { id } = req.params;
    try {
        if (!(req?.user?.isAdmin === true)) {
            if (req?.user?.role === 'buyer') {
                return res.status(400).json({ error: { "email": "Buyer permission denied! only perform Admin!" } })
            }
            if (req?.user?.role === 'rider') {
                return res.status(400).json({ error: { "email": "Rider permission denied! only perform Admin!" } })
            }
            if (req?.user?.role === 'seller') {
                return res.status(400).json({ error: { "email": "Seller permission denied! only perform Admin!" } })
            }
        }
        if (req?.user?.isAdmin === true) {
            const data = await User.findOne({ _id: id }).populate("sellerShop").select("-password");
            if (!data) {
                return res.status({ error: "not found!", data: [] })
            }
            data.status = 'rejected';
            await data.save();
            const sendNotification = {
                sender: req?.user?._id,
                receiver: [data._id],
                message: `Unfortunately ${data.name} Registration Rejected! Please provide to Valid Information`
            }
            await Notification.create(sendNotification)
            const finding = await ProductReview.find({ user: id });
            let totalRate = finding?.length;
            let avgRating = finding?.reduce((acc, item) => item.rating + acc, 0) / finding?.length;
            const user = await User.findOne({ _id: id }).populate("sellerShop", "-user");
            return res.status(200).json({ totalRate, avgRating, data: user })
        }
    }
    catch (error) {
        next(error)
    }
}
const profileView = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(404).json({ error: { email: "doesn't exists" }, data: {} })
        return res.status(200).json({ data: user })
    }
    catch (error) {
        next(error)
    }
}
const userIDLicenseVerify = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    if (!(req?.user?.isAdmin === true)) {
        if (req?.user?.role === 'buyer') {
            return res.status(400).json({ error: { "email": "Buyer permission denied! only perform Admin!" } })
        }
        if (req?.user?.role === 'rider') {
            return res.status(400).json({ error: { "email": "Rider permission denied! only perform Admin!" } })
        }
        if (req?.user?.role === 'seller') {
            return res.status(400).json({ error: { "email": "Seller permission denied! only perform Admin!" } })
        }
    }
    const valid_id = req?.body?.valid_id;
    const license_card = req?.body?.license_card;
    const arrCheck = ['true', 'false', true, false];

    if (!(arrCheck.includes(valid_id?.verify_id))) {
        return res.status(400).json({ error: { verify_id: "Valid ID only accepts Boolean value!" } })
    }
    if (!(arrCheck.includes(license_card?.verify_card))) {
        return res.status(400).json({ error: { verify_card: "LICENSE CARD ID only accepts Boolean value!" } })
    }
    try {
        const verify = await User.findOneAndUpdate({ _id: req.params?.id?.trim() }, {
            valid_id, license_card
        }, { new: true });
        if (!verify) {
            return res.status(400).json({ error: { license_card: "updated failed! please try again!" } })
        }
        if (verify?.valid_id?.valid_id === true && valid_id) {
            const sendNotification = {
                sender: req?.user?._id,
                receiver: [verify._id],
                message: `Congratulations ${data.name} Registration Rejected! Please provide to Valid Data`
            }
            await Notification.create(sendNotification)
        }
        if (verify?.valid_id?.valid_id === false && verify_card) {
            const sendNotification = {
                sender: req?.user?._id,
                receiver: [verify._id],
                message: `Unfortunately ${data.name} Registration Rejected! Please provide to Valid Data`
            }
            await Notification.create(sendNotification)
        }

        return res.status(200).json({ message: "you have successfully updated!", data: verify })
    }
    catch (error) {
        next(error)
    }
}

const verifyPhone = async (req, res, next) => {
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ error: { "otp": "please provide valid otp code!", verify: false } })
    }
    try {
        const check = await verifyOtp(req?.user?.phone, otp);
        if (check === false) {
            return res.status(400).json({ error: { "otp": "Otp Verification Failed!", token: genToken(req?.user?._id), verify: false } })
        } if (check === true) {
            if (req?.user?.role === 'buyer') {
                const data = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                    phoneVerified: true,
                    status: 'approved'
                }, { new: true }).select("-password").select("-adminShop").select("-sellerShop")
                return res.status(200).json({ message: "Otp Verification Successfully! Phone Number Verified", verify: true, token: genToken(data?._id), data: data })
            }
            if (req?.user?.role === 'seller') {
                const data = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                    phoneVerified: true
                }, { new: true }).select("-password").select("-adminShop")
                return res.status(200).json({ message: "Otp Verification Successfully! Phone Number Verified", verify: true, token: genToken(data?._id), data: data })
            }
            if (req?.user?.role === 'rider') {
                const data = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                    phoneVerified: true
                }, { new: true }).select("-password").select("-adminShop").select("-sellerShop")
                return res.status(200).json({ message: "Otp Verification Successfully! Phone Number Verified", verify: true, token: genToken(data?._id), data: data })
            }
            if (req?.user?.isAdmin === true) {
                const data = await User.findOneAndUpdate({ _id: req?.user?._id }, {
                    phoneVerified: true
                }, { new: true }).select("-password").select("-sellerShop")
                return res.status(200).json({ message: "Otp Verification Successfully! Phone Number Verified", verify: true, token: genToken(data?._id), data: data })
            }
        }
    }
    catch (error) {
        next(error)
    }
}
const NotificationTest = async (req, res, next) => {
    try {
        // console.log(io)
        const lastWeek = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
        const today = new Date();
        const notificationToday = await Notification.find({ timestamp: { $gte: today }, receiver: req.user._id });
        const notificationLastWeak = await Notification.find({ timestamp: { $gte: lastWeek }, receiver: req.user._id });
        return res.status(200).json({ today: { today: today, data: notificationToday }, lastWeek: { lastWeek: lastWeek, data: notificationLastWeak } })

    }
    catch (error) {
        next(error)
    }
}

const changedPassword = async (req, res) => {
    //console.log(req.body)
    const { oldPassword, password, password2 } = req.body;
    const user = await User.findOne({ _id: req?.user?._id });
    if (!(oldPassword && (await user.matchPassword(oldPassword)))) {
        return res.status(404).json({ error: "old password does not match!" });
    }
    if (!(password === password2)) {
        return res.status(403).json({ error: "new password and confirm password are not the same!" });
    }
    function checkPassword(password) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
    if (!(checkPassword(password))) {
        return res.status(400).json({ error: { password: "password should contain min 8 letter password, with at least a symbol, upper and lower case" } })
    }
    if (oldPassword && (await user.matchPassword(oldPassword))) {
        user.password = password || user.password;
        const updatedPassword = await user.save();
        if (!updatedPassword) {
            return res.status(400).json({ error: "password change failed, please try again!" });
        } else {
            const resData = await User.findOne({ _id: user?._id }).select("-password");
            return res.status(200).json({
                message: "password has been changes successfully!", user: resData
            });
        }
    }
}

const ForgetPassword = async (req, res, next) => {
    let { phone } = req.body;
    if(!phone.startsWith('+')){
        phone = '+' +phone;
    }
    function validatePhone(elementValue) {
        const re = /^(\+?\(61\)|\(\+?61\)|\+?61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){7,9}$/
        return re.test(elementValue);
    }

    const userCheck = await User.findOne({ phone: phone });
    if (!userCheck) {
        return res.status(400).json({ error: { phone: "User not exists!. Phone Number doesn't match" } })
    }
    try {
        const send = await sendOtpVia(userCheck?.phone);
        if (send?.sent === false) {
            return res.status(400).json({ error: { "phone": "Resend Otp Sending failed! Please try again!", otp: send?.issue, sent: false }, token: genToken(userCheck._id) })
        } if (send?.sent === true) {
            return res.status(200).json({ message: "Resend Otp Sending Successfully!", token: genToken(userCheck._id), sent: true })
        }
    }
    catch (error) {
        next(error)
    }
}

const otpVerifyForgetPass = async (req, res, next) => {
    const { otp } = req.body;
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    if (!otp) {
        return res.status(400).json({ error: { "otp": "please provide valid otp code!", verify: false } })
    }
    try {
        const check = await verifyOtp(req?.user?.phone, otp);
        if (check === false) {
            return res.status(400).json({ error: { "otp": "Otp Verification Failed!", token: genToken(req?.user?._id), verify: false } })
        } if (check === true) {
            return res.status(200).json({ message: 'Redirect To Reset Password', token: genToken(req?.user?._id), verify: true })
        }
    }
    catch (error) {
        next(error)
    }
}
const resetPassword = async (req, res, next) => {
    const { password, password2 } = req.body;
    if (!req?.user?._id) {
        return res.status(400).json({ error: { "email": "permission denied! Please provide valid user credentials and try again!" } })
    }
    if (password !== password2) {
        return res.status(400).json({ error: { password: "New Password And Confirm Password doesn't match!" } })
    }
    try {
        const user = await User.findOne({ _id: req?.user?._id });
        user.password = password;
        await user.save();
        if (req?.user?.role === 'buyer') {
            const data = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop").select("-sellerShop")
            return res.status(200).json({ message: "Password Reset Successfully", token: genToken(data?._id), data: data })
        }
        if (req?.user?.role === 'seller') {
            const data = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop")
            return res.status(200).json({ message: "Password Reset Successfully", token: genToken(data?._id), data: data })
        }
        if (req?.user?.role === 'rider') {
            const data = await User.findOne({ _id: req?.user?._id }).select("-password").select("-adminShop").select("-sellerShop")
            return res.status(200).json({ message: "Password Reset Successfully", token: genToken(data?._id), data: data })
        }
        if (req?.user?.isAdmin === true) {
            const data = await User.findOne({ _id: req?.user?._id }).select("-password").select("-sellerShop")
            return res.status(200).json({ message: "Password Reset Successfully", token: genToken(data?._id), data: data })
        }
    }
    catch (error) {
        next(error)
    }
}

module.exports = { otpVerifyForgetPass, ForgetPassword, resetPassword, changedPassword, resendOtp, NotificationTest, login, registrationSeller, profileView, registrationBuyer, userApproved, userRejected, registrationRider, profileUpdate, singleUser, userIDLicenseVerify, verifyPhone };