import { useEffect, useState } from 'react';
import '../../assets/css/slideshow.css';

const slides = Array.from({ length: 9 }, (_, index) => `/img/SLIDE/slideshow_${index + 1}.jpg`);
const slideDuration = 600;

const SlideShow = () => {
  const [position, setPosition] = useState({ index: 0, animate: true });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPosition((current) =>
        current.index === slides.length ? current : { index: current.index + 1, animate: true },
      );
    }, 2567);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  // Slide into a copy of the first image, then reset invisibly for a seamless loop.
  useEffect(() => {
    if (position.index !== slides.length) return;
    const reset = window.setTimeout(() => {
      setPosition({ index: 0, animate: false });
    }, slideDuration);
    return () => window.clearTimeout(reset);
  }, [position.index]);

  return (
    <div className="product">
      <div id="slideshow" aria-label="Banner giới thiệu dịch vụ">
        <div
          className="dh-slideshow-track"
          style={{
            transform: `translateX(-${position.index * 100}%)`,
            transitionDuration: position.animate ? `${slideDuration}ms` : '0ms',
          }}
        >
          {[...slides, slides[0]].map((src, index) => (
            <div className="dh-slideshow-slide" key={index} aria-hidden={index !== position.index}>
              <img
                src={src}
                alt={`Banner dịch vụ ${(index % slides.length) + 1}`}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideShow;
