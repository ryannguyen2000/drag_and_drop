import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "../background/gridBackground";
import HueAnimate from "../hue-animate";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "ad@123" && password === "1") {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      navigate("/");
    } else {
      setError("Email or Password is invalid!.");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Grid size={200}>
        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="-10%"
          positionY="110%"
        />
        <HueAnimate
          growthX="70%"
          growthY="70%"
          positionX="100%"
          positionY="0%"
        />
        <div className="w-full min-w-[1200px] h-screen relative pl-12 pb-12 pt-6 grid grid-cols-12 gap-48 overflow-hidden z-10">
          <div className="w-full col-span-7 h-[calc(100vh-10rem)] mt-12 overflow-y-scroll scrollbar-none">
            <div className="w-full h-fit grid grid-cols-4 gap-4 p-6"></div>
          </div>
          <div className="col-start-9 col-span-4 relative">
            <div className="w-[600px] h-[800px] bg-white border-l border-gray-100 shadow-xl right-0 absolute rounded-lg -translate-y-[-20%] -translate-x-[20%]">
              <div className="absolute top-[7%] w-full flex flex-col items-center">
                <div className="w-fit flex ">
                  <span className={`text-c1 font-bold text-[3rem] contrast-75`}>
                    TEK
                  </span>
                  <span className={`text-c2 font-bold text-[3rem] contrast-75`}>
                    NIX
                  </span>
                </div>
                <h3 className="w-fit font-semibold text-[32px] ">Login Form</h3>
              </div>
              <form
                className="space-y-6 p-4 translate-y-[250px]"
                onSubmit={handleSubmit}>
                <div className="flex gap-8 flex-col">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 translate-x-[80px]">
                      Email:
                    </label>
                    <div className="mt-1 relative flex items-center justify-center translate-x-[80px] w-[400px]">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className={`block w-full rounded-md border p-2.5 shadow-sm sm:text`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 translate-x-[80px]">
                      Password:
                    </label>
                    <div className="mt-1 relative flex items-center justify-center translate-x-[80px] w-[400px]">
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`block w-full rounded-md border p-2.5 shadow-sm sm:text`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm translate-x-[80px] ">
                    {error}
                  </div>
                )}

                <div className="flex flex-col items-start justify-start w-[400px] translate-x-[80px] translate-y-[30px]">
                  <button
                    type="submit"
                    className="relative inline-flex items-center translate-x-[50px] justify-center py-3 pl-4 pr-12 overflow-hidden font-semibold text-black bg-white border border-black transition-all ease-in-out rounded hover:bg-black hover:text-white group mb-10">
                    <span className="relative w-[250px] text-center transition-colors ease-in-out text-dark group-hover:text-white">
                      Sign in
                    </span>
                  </button>

                  <button
                    type="button"
                    className="relative inline-flex items-center translate-x-[50px] justify-center py-3 pl-4 pr-12 overflow-hidden font-semibold text-white bg-black border border-black transition-all ease-in-out rounded hover:bg-white hover:text-black group mb-10">
                    <span className="relative w-[250px] text-center transition-colors ease-in-out text-dark group-hover:text-black">
                      Sign in with Google
                    </span>
                  </button>
                </div>
              </form>

              <div className="absolute bottom-[5%] w-full flex flex-col items-center">
                <span className="text-sm text-gray-500 underline text-center">
                  TEKNIX Corporation Copyright &copy;
                </span>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default LoginPage;
