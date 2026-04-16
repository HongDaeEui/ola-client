import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import { useProductStore } from "@/stores/product_store.ts";
import { toast } from "sonner";
import { ProductRequest } from "@/models/product.ts";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { add } = useProductStore();

  const [formData, setFormData] = useState<Partial<ProductRequest>>({
    status: 'active',
    price: 0,
    stock: 0,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a name.");
      return;
    }
    if (!formData.category) {
      toast.error("Please enter a category.");
      return;
    }

    try {
      const success = await add({
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        stock: formData.stock || 0,
        category: formData.category || '',
        status: formData.status || 'active',
        image: formData.image || '',
      });

      if (success) {
        toast.success("Created successfully.");
        navigate("/product");
      }
    } catch (error) {
      toast.error(`${error}`);
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
        <BaseButton label="Cancel" color="black" width="72px" onClick={() => navigate("/product")} />
        <BaseButton label="Create" color="blue" width="92px" onClick={handleSave} />
      </div>
    </div>
  );
}
