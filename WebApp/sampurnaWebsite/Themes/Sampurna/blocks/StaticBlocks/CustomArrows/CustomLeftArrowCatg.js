import React, { Component } from 'react';


const CustomLeftArrowCatg = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType }
  } = rest;
  // onMove means if dragging or swiping in progress.
  return <button className={"react-multiple-carousel__arrow react_multiple_carousel__arrow_left_catg"} onClick={() => onClick()} />;
};

export default CustomLeftArrowCatg;