import logo from "../assets/logo/Logo-Aivise-White.png";

const Footer = () => {
  return (
    <footer className="pt-5 h-32 bg-black text-white py-5 px-15 flex justify-between items-center max-sm:flex-col max-sm:justify-center max-sm:gap-3">
      <div className="flex items-center">
        <p>Made by Neuronesia</p>
      </div>
      <div className="right-0 flex flex-col gap-2 max-sm:gap-0">
        <div className="flex gap-1">
          <input
            type="text"
            className="bg-white text-black rounded px-3 py-2"
            placeholder="Enter your email..."
          />
          <button
            type="button"
            className="px-3 bg-black rounded border-1 border-white text-white hover:bg-white hover:text-black hover:border-white cursor-pointer duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
