import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.tsx";
import { useProductStore } from "@/stores/product_store.ts";
import { toast } from "sonner";
import { formatTDate } from "@/lib/formatDate.ts";
import { Product } from "@/models/product.ts";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDetail, update, remove, loading } = useProductStore();

  const [data, setData] = useState<Product | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;

    try {
      const response = await getDetail(Number(id));
      const formatted = {
        ...response.data,
        createdAt: formatTDate(response.data.createdAt),
        updatedAt: formatTDate(response.data.updatedAt),
      };
      setData(formatted);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleEdit = () => {
    setMode("edit");
    setFormData({});
  };

  const handleCancel = () => {
    setMode("view");
    setFormData({});
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      const success = await update(Number(id), {
        name: formData.name || data?.name || '',
        description: formData.description || data?.description || '',
        price: formData.price !== undefined ? formData.price : data?.price || 0,
        stock: formData.stock !== undefined ? formData.stock : data?.stock || 0,
        category: formData.category || data?.category || '',
        status: formData.status || data?.status || 'active',
        image: formData.image || data?.image || '',
      });

      if (success) {
        toast.success("Updated successfully.");
        setMode("view");
        setFormData({});
        fetchDetail();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      const success = await remove(Number(id));
      if (success) {
        toast.success("Deleted successfully.");
        navigate("/product");
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const rows: VerticalRowDef[] = [
    { label: "Name", key: "name", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Price", key: "price", type: "number" },
    { label: "Stock", key: "stock", type: "number" },
    { label: "Category", key: "category", type: "text" },
    { label: "Image", key: "image", type: "text" },
    {
      label: "Status", key: "status",
      type: "toggle",
      toggleOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Out of Stock", value: "out_of_stock" },
      ],
    },
    { label: "Created", key: "createdAt", type: "text", editable: false },
    { label: "Updated", key: "updatedAt", type: "text", editable: false },
  ];

  const tableData = useMemo(() => {
    if (mode === "edit") {
      return { ...(data || {}), ...formData };
    }
    return data || {};
  }, [mode, data, formData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxWidth: "900px" }}>
        <BaseVerticalTable
          rows={rows}
          mode={mode}
          data={tableData}
          labelWidth="150px"
          onChange={handleChange}
        />
      </div>

      {mode === "view" ? (
        <div className="flex justify-between items-center" style={{ padding: "16px 0" }}>
          <BaseButton label="Delete" color="negative" width="72px" onClick={() => setDeleteDialogOpen(true)} />
          <div className="flex" style={{ gap: "36px" }}>
            <BaseButton label="List" color="black" width="60px" onClick={() => navigate("/product")} />
            <BaseButton label="Edit" color="blue" width="60px" onClick={handleEdit} />
          </div>
        </div>
      ) : (
        <div className="flex justify-end" style={{ padding: "16px 0", gap: "36px" }}>
          <BaseButton label="Cancel" color="black" width="72px" onClick={handleCancel} />
          <BaseButton label="Save" color="blue" width="108px" onClick={handleSave} />
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you sure you want to delete?"
        description={`"${data?.name}" will be deleted. This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Confirm"
      />
    </div>
  );
}
