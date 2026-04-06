const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4 md:p-6 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-slate-500 text-center md:text-left">
          <span className="font-semibold text-indigo-600 uppercase tracking-wider">
            Bolt Mode
          </span>{" "}
          &copy; {currentYear}. All rights reserved.
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <a
            href="#"
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Support
          </a>
          <a
            href="#"
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </a>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <i className="pi pi-facebook cursor-pointer hover:text-indigo-600 transition-colors"></i>
          <i className="pi pi-twitter cursor-pointer hover:text-indigo-600 transition-colors"></i>
          <i className="pi pi-github cursor-pointer hover:text-indigo-600 transition-colors"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
