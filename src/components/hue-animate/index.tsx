import React, {FC} from "react";

type HueAnimateProps = {
  className?: string;
};
const HueAnimate: FC<HueAnimateProps> = ({className}) => {
  return (
    <div
      className={`animate-hue fixed z-0 w-full h-full ${className}`}
      style={{
        backgroundSize: "100% 100%",
        backgroundPosition: "0px 0px",
        backgroundImage:
          "radial-gradient(70% 70% at 50% 50%, #FF900014 0%, #073AFF00 100%)",
      }}
    />
  );
};

export default HueAnimate;
// animation

// @keyframes hueRotate {
//     0% {
//       filter: hue-rotate(0deg);
//     }
//     100% {
//       filter: hue-rotate(360deg);
//     }
//   }

//   .animate-hue {
//     animation: hueRotate 20s linear infinite;
//   }
