'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import SliderData from "../Slider/sliderData";

const Slider = ({ slides } : {slides: any}) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <div id='courses' className='max-w-[1240px] mx-auto'>
      <h1 className='text-2xl font-bold text-center p-4 bg-gray-900 shadow-2xl  text-white rounded-full'>Cursos</h1>
      <div className='relative flex justify-center p-4'>

      {SliderData.map((slide, index) => {
        return (
          <div
            key={index}
            className={
              index === current
                ? 'opacity-[1] ease-in duration-1000'
                : 'opacity-0'
            }
          >
              <FaArrowCircleLeft
                onClick={prevSlide}
                className='absolute top-[50%] left-[30px] text-white/70 cursor-pointer select-none z-[2]'
                size={50}
              />
              {index === current && (
                <div>
                  <h2 className="bg-pink-300 rounded-full text-2xl font-bold text-center mb-2 text-pink-900">{slide.title}</h2>
                  <Image
                    src={slide.image}
                    alt={slide.title} // Use the title as alt text
                    width='1440'
                    height='600'
                  />
                </div>
              )}
              <FaArrowCircleRight
                onClick={nextSlide}
                className='absolute top-[50%] right-[30px] text-white/70 cursor-pointer select-none z-[2]'
                size={50}
              />
            </div>
        );
    })}
    </div>
    </div>
  );
};

export default Slider;