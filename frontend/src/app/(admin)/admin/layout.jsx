import AdminSidebar from "@/app/components/admin/sidebar/sidebar";
import AdminHeader from "@/app/components/admin/header/header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
