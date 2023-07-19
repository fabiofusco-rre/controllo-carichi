import React from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./styles.css";

function SliderComponent(props) {
  const { colorFirstThumb, colorSecondThumb } = props;
  return (
    <div style={{ "--rangeColor": props?.rangeColor, "--colorFirstThumb": colorFirstThumb, "--colorSecondThumb": colorSecondThumb}}>
      <RangeSlider id="range-slider-bt" {...props} />
    </div>
  );
}

export default SliderComponent;
