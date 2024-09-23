import { useCallback, useEffect, useState } from "react";

const Carosule = () => {
  const [currentSlider, setCurrentSlider] = useState(0);
  const carouselImages = [
    "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1719749990914-a3ba54e6343f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1467195468637-72eb862bb14e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1532155297578-a43684be8db8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
//   const prevSlider = () =>
//     setCurrentSlider((currentSlider) =>
//       currentSlider === 0 ? carouselImages.length - 1 : currentSlider - 1
//     );
  const nextSlider = useCallback(
    () =>
      setCurrentSlider((currentSlider) =>
        currentSlider === carouselImages.length - 1 ? 0 : currentSlider + 1
      ),
    [carouselImages.length]
  );


  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlider();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [nextSlider]);
  return (
    <div className=" mx-auto lg:h-[522px] mt-6 rounded-lg relative overflow-hidden">
      <div className="flex justify-center items-center rounded-full z-10 absolute bottom-4 w-full gap-1">
        {carouselImages.map((img, idx) => (
          <button
            key={`${img}_${idx}`}
            onClick={() => setCurrentSlider(idx)}
            className={`rounded-full duration-500 bg-white ${
              currentSlider === idx ? "w-8" : "w-2"
            } h-2`}
          ></button>
        ))}
      </div>
      {/* Carousel container */}
      <div
        className="ease-linear duration-500 flex transform-gpu"
        style={{ transform: `translateX(-${currentSlider * 100}%)` }}
      >
        {/* sliders */}
        {carouselImages.map((slide, idx) => (
          <img
            key={slide}
            src={slide}
            className="min-w-full h-60 bg-black/20 sm:h-96 md:h-[540px] object-cover"
            alt={`Slider - ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carosule;
