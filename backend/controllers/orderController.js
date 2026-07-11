import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import Razorpay from 'razorpay'

const currency = 'inr'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const placeOrder = async (req, res) => {
    try {

        const { items, amount, address } = req.body;
        const userId = req.userId;

        // basic validation
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing userId (authentication failed).' });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order.' });
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid order amount.' });
        }
        if (!address || typeof address !== 'object') {
            return res.status(400).json({ success: false, message: 'Missing address.' });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // clear user's cart if user exists
        if (userId) {
            try {
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
            } catch (err) {
                console.error('Failed to clear user cart:', err);
            }
        }
        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.error('placeOrder error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error placing order' });
    }
}

const placeOrderStripe = async (req, res) => {
   try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
             price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount:  deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:'payment',
        })

        res.json({success:true,session_url:session.url});

   }catch (error){
    console.log(error)
    res.json({success:false,message:error.message})

   }
}

const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    const userId = req.userId;
    try{
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true});
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false});
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const placeOrderRazorpay = async (req, res) => {
    try {
         const { items, amount, address } = req.body;
         const userId = req.userId;
    const { origin } = req.headers;

    const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };
        await razorpayInstance.orders.create(options, async (error, order) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: error});
            } 
                res.json({ success: true, order });
        
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const userId = req.userId;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment verified successfully" });
        }else{
            res.json({ success: false, message: "Payment not verified" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find();
        res.json({ success: true, orders });
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const userOrders = async (req, res) => {
    try{
        const userId = req.userId;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

const updateStatus = async (req, res) => {
    try{
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status updated successfully" });

    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }