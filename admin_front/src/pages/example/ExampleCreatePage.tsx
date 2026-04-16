import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import { useExampleStore } from "@/stores/example_store.ts";
import { toast } from "sonner";
import { ExampleRequest } from "@/models/example.ts";

export default function ExampleCreatePage() {
  const navigate = useNavigate();
  const { add } = useExampleStore();

  const [formData, setFormData] = useState<Partial<ExampleRequest>>({
    status: 'draft',
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Please enter a title.");
      return;
    }

    try {
      const success = await add({
        title: formData.title || '',
        content: formData.content || '',
        status: formData.status || 'draft',
      });

      if (success) {
        toast.success("Created successfully.");
        navigate("/example");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const rows: VerticalRowDef[] = [
    { label: "Title", key: "title", type: "text" },
    { label: "Content", key: "content", type: "textarea" },
    {
      label: "Status", key: "status",
      type: "toggle",
      toggleOptions: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
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
        <BaseButton label="Cancel" color="black" width="72px" onClick={() => navigate("/example")} />
        <BaseButton label="Create" color="blue" width="92px" onClick={handleSave} />
      </div>
    </div>
  );
}
