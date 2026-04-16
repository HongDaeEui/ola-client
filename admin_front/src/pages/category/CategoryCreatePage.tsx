import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import { useCategoryStore } from "@/stores/category_store.ts";
import { toast } from "sonner";
import { CategoryRequest } from "@/models/category.ts";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { add } = useCategoryStore();

  const [formData, setFormData] = useState<Partial<CategoryRequest>>({
    isActive: true,
    order: 0,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a name.");
      return;
    }
    if (!formData.slug) {
      toast.error("Please enter a slug.");
      return;
    }

    try {
      const success = await add({
        name: formData.name || '',
        slug: formData.slug || '',
        description: formData.description || '',
        parentId: formData.parentId,
        order: formData.order || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      });

      if (success) {
        toast.success("Created successfully.");
        navigate("/category");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const rows: VerticalRowDef[] = [
    { label: "Name", key: "name", type: "text" },
    { label: "Slug", key: "slug", type: "text" },
    { label: "Description", key: "description", type: "textarea" },
    { label: "Parent ID", key: "parentId", type: "number" },
    { label: "Order", key: "order", type: "number" },
    {
      label: "Active", key: "isActive",
      type: "toggle",
      toggleOptions: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  ];

  return (
    <div>
      <div style={{ maxWidth: "900px" }}>
        <BaseVerticalTable
          rows={rows}
          mode="create"
          data={formData}
          labelWidth="150px"
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end" style={{ padding: "16px 0", gap: "36px" }}>
        <BaseButton label="Cancel" color="black" width="72px" onClick={() => navigate("/category")} />
        <BaseButton label="Create" color="blue" width="92px" onClick={handleSave} />
      </div>
    </div>
  );
}
