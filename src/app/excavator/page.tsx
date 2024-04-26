"use client";

// import { Metadata } from "next";
import { useEffect } from "react";
import "./styles.module.scss";
import gsap from "gsap";

// export const metadata: Metadata = {
//   title: "Vegabarca - 3D spin example with GSAP",
// };

const Excavator = () => {
  const loadExcavator = () => {
    const canvas: HTMLCanvasElement = document.getElementById(
      "excavator",
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!context) return;

    canvas.width = 1158;
    canvas.height = 770;

    const frameCount = 147;
    const currentFrame = (i: number) =>
      `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(i + 1).toString().padStart(4, "0")}.jpg`;

    let images: Array<HTMLImageElement> = [];
    const airpods = {
      frame: 0,
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images = [...images, img];
    }

    gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 0.5,
      },
      onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    images[0].onload = render;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[airpods.frame], 0, 0);
    }
  };

  useEffect(() => {
    loadExcavator();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Excavator example in GSAP</h1>
      <canvas id="excavator"></canvas>
    </div>
  );
};

export default Excavator;
