import { Outlet } from "react-router-dom";

const ContainerLayout = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
};

export default ContainerLayout;
