import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

const BackToPage = () => {
  return (
    <div className="flex justify-start ">
      <Link to={"/documents"}>
        <button className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-primary transition-all duration-300 ease-in-out rounded hover:pl-10 hover:pr-6 hover:bg-black group">
          <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ease-in-out bg-primary group-hover:h-full" />
          <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-300">
            <Icon icon="mynaui:arrow-left" className="text-white w-6 h-6" />
          </span>
          <span className="relative w-full text-left transition-colors duration-300 ease-in-out text-dark group-hover:text-white underline group-hover:no-underline">
            Back To Pages
          </span>
        </button>
      </Link>
    </div>
  );
};

export default BackToPage;
