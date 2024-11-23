import { Link } from "react-router-dom";
import TextFalling from "../../../components/animation/text/textFalling";

export const DocumentHeader = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full flex justify-between items-center">
        <div />

        {/* HEADING */}
        <Link to={"/documents"}>
          <TextFalling text="ALL DOCUMENT" delay={50} />
        </Link>

        {/* Empty right section */}
        <div />
      </div>
    </div>
  );
};
