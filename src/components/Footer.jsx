import logo from "../assets/logo/Logo-Aivise-White.png";

const Footer = () => {
  return (
    <footer className="pt-5 h-50 bg-black text-white py-4">
      <div className="relative container mx-auto">
        <div className="absolute inset-y-0 right-0">
            <h4 className="text-2xl font-bold">Subscribe</h4>
            <p className="max-w-60 text-base/5">Enter your email to get notified about our new solutions!</p>
            <input type="text" className="mt-5 bg-white text-black rounded" placeholder="Enter your email..."/>
            <button type="button" className="px-3 bg-gray-500 rounded">Send</button>
            <p>&copy; {new Date().getFullYear()} Aivise</p>
        </div>
        <div className="absolute inset-y-0 left-0">
            <img src={logo} alt="" className="w-[120px]"/>
        </div>
     </div>
    </footer>
  );
};

export default Footer;