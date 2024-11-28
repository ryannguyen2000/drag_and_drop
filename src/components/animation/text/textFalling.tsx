const TextFalling = ({
  text = "ALL DOCUMENT",
  delay = 75,
}: {
  text: string;
  delay?: number;
}) => {
  const fallingText = text.split("");

  return (
    <div
      className="relative mx-auto flex justify-center items-center w-fit h-fit cursor-pointer before:absolute before:-top-3 before:border-t-[6px] before:border-black
        before:w-full before:h-2 before:content-[''] after:absolute after:-bottom-4 after:border-b-[6px] after:border-black after:w-full 
        after:h-2 after:content-['']"
    >
      <div className="group relative inline-block overflow-hidden">
        {/* Main text */}
        <div className="relative flex space-x-2">
          {fallingText.map((char, index) => (
            <span
              key={index}
              className="relative text-xl md:text-2xl xl:text-4xl font-bold text-neutral-900 cursor-pointer transition-transform duration-500 group-hover:translate-y-20"
              style={{
                transitionDelay: `${index * delay}ms`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Text Falling*/}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex justify-center space-x-2"
        >
          {fallingText.map((char, index) => (
            <span
              key={`drop-${index}`}
              className="text-xl md:text-2xl xl:text-4xl font-bold text-black transition-transform duration-500 translate-y-[-150%] group-hover:translate-y-0"
              style={{
                transitionDelay: `${index * delay}ms`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextFalling;
