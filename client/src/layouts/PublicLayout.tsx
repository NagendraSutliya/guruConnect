import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto mt-16">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PublicLayout;
