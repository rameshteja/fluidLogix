"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/truck/truck1.jpg",
    title: "Manage Every Load,",
    highlight: "Every Tanker,",
    ending: "Every Trip",
    description:
      "Manage your complete water and chemical transport operation from one powerful platform.",
  },
  {
    image: "/images/truck/truck2.jpg",
    title: "Power Your Fleet,",
    highlight: "Track Every Trip,",
    ending: "In Real Time",
    description:
      "Track vehicles, drivers, loads and deliveries with complete visibility across your fleet.",
  },
  {
    image: "/images/truck/truck3.jpg",
    title: "Smarter Water",
    highlight: "Transport Management",
    ending: "Starts Here",
    description:
      "Digitize loading, unloading, vehicle assignments, billing and operational reporting.",
  },
  {
    image: "/images/truck/truck4.jpg",
    title: "From Loading",
    highlight: "To Delivery,",
    ending: "Stay In Control",
    description:
      "Get complete traceability across every tanker, driver, company and delivery.",
  },
  {
    image: "/images/truck/truck5.jpg",
    title: "One Platform,",
    highlight: "Complete Fleet",
    ending: "Visibility",
    description:
      "Connect fleet owners, drivers and companies through a single secure platform.",
  },
  {
    image: "/images/truck/truck6.jpg",
    title: "Track Every Load",
    highlight: "From Pickup To Delivery",
    ending: "Stay In Control",
    description:
      "Get complete traceability across every tanker, driver, company and delivery.",
  },
  {
    image: "/images/truck/truck7.jpg",
    title: "Connect Fleet & Industrial Operations",
    highlight: "Track Every Trip",
    ending: "In Real Time",
    description:
      "Track vehicles, drivers, loads and deliveries with complete visibility across your fleet.",
  },];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[current];

  return (
    <section
      className="relative min-h-[650px] overflow-hidden sm:min-h-[700px] lg:min-h-[760px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {slides.map((item, index) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-all duration-1000 ${index === current
            ? "scale-100 opacity-100"
            : "scale-105 opacity-0"
            }`}
        >
          <Image
            src={item.image}
            alt="Water tanker transport"
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071522]/95 via-[#071522]/70 to-[#071522]/40" />

      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20 sm:min-h-[700px] lg:min-h-[760px] lg:px-8">
        <div className="max-w-4xl">

          {/* Animated Heading */}
          <div
            key={current}
            className="animate-[fadeIn_0.8s_ease-out]"
          >
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[58px]">
              {slide.title}
              <br />

              <span className="text-[#FFA500]">
                {slide.highlight}
              </span>

              <br className="hidden sm:block" />

              <span className="text-white">
                {" "}
                {slide.ending}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              {slide.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] px-7 py-3.5 text-sm font-bold text-[#071522] shadow-xl shadow-orange-500/20 transition hover:bg-[#FFB52E]"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              View Admin Demo
            </Link>
          </div>

          {/* Slider Indicators */}
          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === current
                  ? "w-10 bg-[#FFA500]"
                  : "w-5 bg-white/30 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 hidden items-center gap-2 text-xs text-white/40 sm:flex">
            <ChevronDown size={15} />
            Scroll to explore
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071522] to-transparent" />
    </section>
  );
}