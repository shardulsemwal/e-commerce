import React, {useContext, useEffect, useState} from 'react'
import { ShopContext } from '../context/ShopContext'
import {assets} from '../assets/assets'
import { useLocation } from 'react-router-dom'
import NewsletterBox from '../components/NewsletterBox'
import Title from '../components/Title'
import RelatedProducts from '../components/RelatedProducts'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useRef } from 'react'
import { useCallback } from 'react'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for(const item in cartItems[items]){
        if(cartItems[items][item] > 0){
          tempData.push({
            _id: items,
            size:item,
            quantity : cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
  }, [cartItems])

  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text={'YOUR'} text2={'CART'} />
      </div>

        <div>
          {
            cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              return (
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-col-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                    <div>
                    <p className='text-xm sm:text font-medium'>{productData.name}</p>
                    <div className='flex gap-5 mt-2 items-center'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                    </div>
                  </div>
                  <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} type="number" min ={1} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' defaultValue={item.quantity} />
                  <img onClick={() => updateQuantity(item._id, item.size,0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
                </div>                
              )
            }
            )
          }
        </div>
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <div className=' w-full text-end'>
              <button className='bg-black text-white px-8 py-3 my-8' onClick={() => navigate('/place-order')}>PROCEED TO CHECKOUT</button>
            </div>
          </div>

        </div>
      </div>
  )
}

export default Cart
