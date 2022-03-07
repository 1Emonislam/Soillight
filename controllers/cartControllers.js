const Cart = require('../models/cart');
const Product = require('../models/productModel')
const addProductToCart = async (req, res, next) => {
    let { productId, quantity, note } = req.body;
    let data = null;
    try {
        quantity = Number.parseInt(quantity);
        let cart = await Cart.findOne({ userId: req.user._id });
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error:{product:'Product Not Founds! 404'}})
        }
        console.log("product", product)

        //-- Check if cart Exists and Check the quantity if items -------
        if (cart) {
            let indexFound = cart.items.findIndex(p => p.productId == productId);
            // console.log("Index", indexFound)
            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            if (indexFound != -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * product.price;
                cart.items[indexFound].price = product.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
            }
            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: product.price,
                    total: parseInt(product.price * quantity).toFixed(2),
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, curr) => acc + curr);
            }
            //----if quantity of price is 0 throw the error -------
            else {
                return res.status(400).json({
                    code: 400,
                    message: "Invalid request! Please try again!"
                })
            }

            data = await cart.save();
        }
        //------if there is no user with a cart then it creates a new cart and then adds the item to the cart that has been created---------
        else {
            const cartData = {
                userId: req.user._id,
                items: [{
                    productId: productId,
                    quantity: quantity,
                    total: parseInt(product.price * quantity),
                    price: product.price,
                    note: note

                }],
                subTotal: parseInt(product.price * quantity)
            }
            cart = new Cart(cartData);
            data = await cart.save();
        }
        return res.status(200).json({
            code: 200,
            message: "Add to Cart successfully!",
            data: data
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {addProductToCart};