import NavBar from "./NavBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="max-w-7x1 m-auto p-4">{children}</main>
    </>
  );
};

export default AdminLayout;
