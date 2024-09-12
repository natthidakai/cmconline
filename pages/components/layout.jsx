import BackToTop from "./backTotop";
import Footer from "./footer";
import Menubar from "./navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Menubar/>
        {children}
        <BackToTop/>
      <Footer/>
    </>
  );
};

export default Layout;
