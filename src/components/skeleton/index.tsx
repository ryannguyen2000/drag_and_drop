import React, {FC} from "react";

type CardSkeletonProps = {
  size?: number;
  count?: number;
};
const CardSkeleton: FC<CardSkeletonProps> = ({size = 4, count = 1}) => {
  return (
    <>
      {Array.from({length: count}).map((_, cdex) => (
        <div
          key={cdex}
          className="animate-pulse relative flex aspect-[1.2] h-full w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-[2rem] bg-white p-4 shadow-md transition-all duration-500"
        >
          <div className="animate-pulse aspect-[2.5] w-full rounded-xl bg-slate-100"></div>
          <div className="w-[calc(100%-2rem)] absolute h-fit bottom-4 flex flex-col gap-4">
            {Array.from({length: size}, (_, index) => (
              <div
                key={index}
                className="animate-pulse bg-slate-100 h-[clamp(0.3rem,10vw,2.5rem)] max-h-10 w-full rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
