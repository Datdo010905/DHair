import React, { useEffect } from "react";

const SlideShow = () => {
  const nextSlide = () => {
    const slideImg = document.getElementById("slide_dv") as HTMLImageElement;
    const currentSrc = slideImg.src;
    const currentIndex = parseInt(currentSrc.match(/slideshow_(\d+)\.jpg/)![1]);
    const nextIndex = currentIndex === 9 ? 1 : currentIndex + 1;
    slideImg.src = `img/SLIDE/slideshow_${nextIndex}.jpg`;
  };

  // const autoSlide = () => {
  //   setInterval(nextSlide, 2567);
  // };

  useEffect(() => {
   const interval = setInterval(nextSlide, 2567);

   //cleanup khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="product">
      <div id="slideshow">
        <img id="slide_dv" src="/img/SLIDE/slideshow_1.jpg" />
      </div>
    </div>
  );
};

export default SlideShow;