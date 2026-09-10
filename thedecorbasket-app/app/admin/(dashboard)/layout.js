import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — The Decor Basket", robots: "noindex, nofollow" };

export default function DashboardLayout({ children }) {
  return (
    <div className="admin-shell flex">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
