import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.</p>
          <p>Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.Forever ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies lacinia, nunc nisl aliquam nisl, eget ultricies nisl nunc eget nisl.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our Mission to make a positive impact on the world by providing high-quality products and exceptional customer service.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 '>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>We maintain the highest standards of quality in all our products and services.</p>
        </div>
  
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Customer Satisfaction</b>
          <p className='text-gray-600'>We are committed to ensuring our customers are completely satisfied with their purchase.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Service</b>
          <p className='text-gray-600'>We are dedicated to providing exceptional service to all our customers.</p>
        </div>
      </div>

    <NewsletterBox />

    </div>
  )
}

export default About
