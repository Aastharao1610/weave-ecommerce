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

// "use client";
// import { useState } from "react";
// import AdminSidebar from "@/app/components/admin/sidebar/sidebar";
// import AdminHeader from "@/app/components/admin/header/header";
// import { Menu } from "lucide-react";

// export default function AdminLayout({ children }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   return (
//     <div className="flex h-screen overflow-hidden relative">
//       {/* Sidebar - hidden on small screens */}
//       <div
//         className={`fixed z-40 inset-y-0 left-0 transform bg-white w-64 shadow-md transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 md:static md:inset-auto md:shadow-none`}
//       >
//         <AdminSidebar closeSidebar={closeSidebar} />
//       </div>

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col md:ml-64">
//         {/* Header with mobile toggle button */}
//         <div className="md:hidden p-4 bg-white shadow-md flex items-center justify-between">
//           <button onClick={toggleSidebar} className="text-gray-800">
//             <Menu size={28} />
//           </button>
//           <span className="text-xl font-semibold text-gray-800">
//             Admin Panel
//           </span>
//         </div>

//         {/* Header (for larger screens) */}
//         <div className="hidden md:block">
//           <AdminHeader />
//         </div>

//         <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
