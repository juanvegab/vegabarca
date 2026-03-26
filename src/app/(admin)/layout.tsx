import NavBar from "./NavBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-6 py-4">{children}</main>
    </>
  );
};

export default AdminLayout;
