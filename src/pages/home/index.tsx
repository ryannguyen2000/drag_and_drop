import React, {FC} from "react";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/editor")}>Go editor</button>
    </div>
  );
};

export default HomePage;
