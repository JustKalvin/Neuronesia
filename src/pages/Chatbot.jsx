import React from "react";
import Logo from "../assets/logo/Logo-Dark.png";

const Chatbot = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-between items-center">
      <div>
        <div className="h-[70px] bg-red-100 flex flex-col justify-center pl-[20px]">
          <img src={Logo} alt="logo-png" className="w-[150px]" />
        </div>

        <div>
          <div className="flex justify-start">
            <p className="bg-blue-200 mx-[200px] my-[35px] rounded-[10px] px-5 py-3 inline-block">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est error
              labore molestias ipsa doloremque, iusto totam officia amet
              voluptatem nemo consequuntur! Maiores eius sunt illum, quas unde
              repudiandae minima dolores omnis quae perspiciatis totam veritatis
              inventore provident, assumenda, beatae consequatur. Ex doloribus
              unde ipsum cum excepturi fugiat quos repellendus obcaecati aperiam
              tempora minus eius sequi natus temporibus sit eos ea, quisquam
              nobis reiciendis ducimus? Fuga voluptatem itaque assumenda dolore
              architecto ducimus reiciendis dolor ex neque id quae velit
              molestiae, magni autem a similique veniam modi facere! Mollitia
              alias esse atque rem ullam. Nobis ipsa fuga iste dolorem nostrum,
              aspernatur labore.
            </p>
          </div>

          <div className="flex justify-end">
            <p className="bg-red-200 mx-[200px] rounded-[10px] px-5 py-3 text-right inline-block">
              can u help me?
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 w-full">
        <input type="text" className="border-1 border-solid rounded-[5px] w-[1000px] mx-[200px]" />
      </div>
    </div>
  );
};

export default Chatbot;
