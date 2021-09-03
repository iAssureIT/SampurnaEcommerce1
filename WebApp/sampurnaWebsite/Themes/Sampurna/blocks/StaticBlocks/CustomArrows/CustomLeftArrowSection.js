import React, { Component } from 'react';


const CustomLeftArrowSection = ({ onClick, ...rest }) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType }
  } = rest;
  // onMove means if dragging or swiping in progress.
  return <button className={"react-multiple-carousel__arrow react_multiple_carousel__arrow_left_section"} onClick={() => onClick()} />;
};

export default CustomLeftArrowSection;