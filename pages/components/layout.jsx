import Footer from "./footer";
import Menubar from "./navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Menubar/>
        {children}
      <Footer/>
    </>
  );
};

export default Layout;
