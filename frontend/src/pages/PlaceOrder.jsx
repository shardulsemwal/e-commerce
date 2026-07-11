import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'


const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phoneNumber: ''
    });

    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(true), { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout script')), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
        document.body.appendChild(script);
      });
    };

    const initPay = async (order) => {
        await loadRazorpayScript();

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Order Payment",
            description: "Payment for your order",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
              console.log(response);
              try{
                const {data} = await axios.post(backendUrl + '/api/order/verify-razorpay',response,{headers: {token}});
                if (data.success) {
                    setCartItems({});
                    navigate('/orders');
                }

              } catch (error) {
                console.log(error);
                toast.error(error.message);
              }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;

      setFormData(data => ({...data,[name]: value}));
    }

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      
      if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      try {

        let orderItems = [];
        
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if(cartItems[items][item] > 0){
              const itemInfo = structuredClone(products.find((product) => product._id === items));
              if(itemInfo) {
                itemInfo.size = item;
                itemInfo.quantity = cartItems[items][item];
                orderItems.push(itemInfo);
              }
            }
          }
        }

        let orderData = {
          address: formData,
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
        }
        switch (method) {
            case 'cod':
              const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}});

              if(response.data.success){
                setCartItems({});
                navigate('/orders');
              }else{
                toast.error(response.data.message);
              }
              break;

              case 'stripe':
                const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}});
                if(responseStripe.data.success){
                  const {session_url} = responseStripe.data;
                  window.location.replace(session_url);
                }else{
                  toast.error(responseStripe.data.message);
                }
                // TODO: Implement Stripe payment
                break;

              case 'razorpay':
                const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers: {token}});
                if(responseRazorpay.data.success){
                  console.log(responseRazorpay.data.order);
                  initPay(responseRazorpay.data.order);
                }
                break;

              default:
                break;
        }

      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }

  return (
    <form className='flex flex-col sm:flex-row gap-4 justify-between pt-5 sm:pt-14 min-h-[80vh] border-t' onSubmit={onSubmitHandler}>
      {/* --------left side-------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} value={formData.firstName} type="text" name='firstName' placeholder='First Name' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
          <input required onChange={onChangeHandler} value={formData.lastName} type="text" name='lastName' placeholder='Last Name' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} value={formData.email} type="email" name='email' placeholder='Email Address' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
        <input required onChange={onChangeHandler} value={formData.street} type="text" name='street' placeholder='Street' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />

      <div className='flex gap-3'>
        <input required onChange={onChangeHandler} value={formData.city} type="text" name='city' placeholder='City' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
        <input required onChange={onChangeHandler} value={formData.state} type="text" name='state' placeholder='State' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
      </div>
      
      <div className='flex gap-3'>
        <input required onChange={onChangeHandler} value={formData.zipCode} type="number" name='zipCode' placeholder='Zip Code' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
        <input required onChange={onChangeHandler} value={formData.country} type="text" name='country' placeholder='Country' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
      </div>
        <input required onChange={onChangeHandler} value={formData.phoneNumber} type="number" name='phoneNumber' placeholder='Phone Number' className='border border-gray-300 rounded px-3.5 py-1.5 w-full' />
      </div>

      {/* --------right side-------- */}
      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

      <div className=' mt-12'>
        <Title text1={'PAYMENT'} text2={'METHOD'} />
        {/* payment method */}
        <div className='flex flex-col gap-3 lg:flex-row'>
      <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
          <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe'? 'bg-blue-400' : ''} `}>  </p>
          <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
      </div>
      <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
        <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay'? 'bg-blue-400' : ''} `}>  </p>
        <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
      </div>
      <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
        <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod'? 'bg-blue-400' : ''} `}>  </p>
        <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
      </div>
      </div>

      <div className='w-full text-end mt-8'>
        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>

      </div>
    </div>
   </div>
  </form>
  );
}
export default PlaceOrder
