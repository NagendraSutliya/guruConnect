import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PublicLayout;
