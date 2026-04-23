import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const StatCard = ({ title, value, icon: Icon, colorClass, shadowColor }) => {
  const numberRef = useRef(null);

  useGSAP(() => {
    gsap.from(numberRef.current, {
      textContent: 0,
      duration: 1.5,
      ease: "power2.out",
      snap: { textContent: 1 },
      stagger: 1,
    });
  }, [value]);

  return (
    <div className="glass-card p-6 flex items-center justify-between group">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 ref={numberRef} className="text-4xl font-bold text-white tracking-tight">
          {value}
        </h3>
      </div>
      <div 
        className={`w-14 h-14 rounded-full flex items-center justify-center glass ${colorClass} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
        style={{ boxShadow: `0 0 20px ${shadowColor}` }}
      >
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );
};

export default StatCard;
