import React from 'react'

const Details = () => {
  return (
    <div className='flex flex-col md:flex-row max-w-1/2 h-[600px] gap-x-5 gap-y-6 mx-auto mt-[124px] px-16 py-8 container'>
        <div className='relative w-full h-[400px] overflow-hidden'>
            <img src="https://images.pexels.com/photos/786806/pexels-photo-786806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt=""
            className='object-cover w-full h-full rounded-[24px] md:h-[400px]'
            />
        </div>

        <div className='flex flex-col h-full w-full py-10 px-16'>
            <h1 className='font-bold text-5xl text-green-600'> <span className='font-medium text-3xl text-black'>What is </span><br /> ECOPRO</h1>
            <p className='text-xl py-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates quos praesentium deserunt itaque natus eius tempora enim accusamus officia blanditiis quibusdam rem illum porro suscipit vero delectus, quo, numquam sed.</p>
        </div>
    </div>
  )
}

export default Details
