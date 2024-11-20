const convertJustify = (justifyContent): string => {
  const justifyClasses = {
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    center: "justify-center",
    "space-around": "justify-around",
    "space-between": "justify-between",
    "space-evenly": "justify-evenly",
  };

  return justifyClasses[justifyContent];
};

const convertAlign = (alignItems): string => {
  const alignClasses = {
    center: "items-center",
    "flex-start": "items-start",
    "flex-end": "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  return alignClasses[alignItems];
};

export {convertAlign, convertJustify};
