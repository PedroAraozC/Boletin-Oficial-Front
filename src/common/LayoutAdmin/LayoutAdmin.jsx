import NavBarAdmin from "./NavBarAdmin";

// eslint-disable-next-line react/prop-types
const LayoutAdmin = ({ children }) => {

  return (
    <>
      <NavBarAdmin />
      {children}
    </>

  );
};

export default LayoutAdmin;
