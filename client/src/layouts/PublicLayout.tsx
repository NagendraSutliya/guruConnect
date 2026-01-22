import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PublicLayout;
