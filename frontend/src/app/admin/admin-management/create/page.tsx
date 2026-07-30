import AdminForm from "@/components/admin/admin-management/AdminForm";

export default function CreateAdminPage() {
  return (
    <div className="p-0 sm:p-2">

      <h1 className="text-2xl font-bold mb-6">
        Add New Admin
      </h1>

      <AdminForm />

    </div>
  );
}
