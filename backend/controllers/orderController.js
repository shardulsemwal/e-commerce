

const placeOrder = async (req, res) => {
    try {

        const { userId, items, amount, address} = req.body;

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

        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order placed successfully" });

    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }

}

const placeOrderStripe = async (req, res) => {


}

const placeOrderRazorpay = async (req, res) => {


}

const allOrders = async (req, res) => {


}

const userOrders = async (req, res) => {


}

const updateStatus = async (req, res) => {


}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }