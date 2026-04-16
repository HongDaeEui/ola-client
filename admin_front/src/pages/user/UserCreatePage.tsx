import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import { useUserStore } from "@/stores/user_store.ts";
import { toast } from "sonner";
import { UserRequest } from "@/models/user.ts";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { add } = useUserStore();

  const [formData, setFormData] = useState<Partial<UserRequest>>({
    role: 'user',
    status: 'active',
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a name.");
      return;
    }
    if (!formData.email) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      const success = await add({
        name: formData.name || '',
        email: formData.email || '',
        role: formData.role || 'user',
        status: formData.status || 'active',
        phone: formData.phone || '',
      });

      if (success) {
        toast.success("Created successfully.");
        navigate("/user");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const rows: VerticalRowDef[] = [
    { label: "Name", key: "name", type: "text" },
    { label: "Email", key: "email", type: "text" },
    { label: "Phone", key: "phone", type: "text" },
    {
      label: "Role", key: "role",
      type: "toggle",
      toggleOptions: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
      ],
    },
    {
      label: "Status", key: "status",
      type: "toggle",
      toggleOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
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
        <BaseButton label="Cancel" color="black" width="72px" onClick={() => navigate("/user")} />
        <BaseButton label="Create" color="blue" width="92px" onClick={handleSave} />
      </div>
    </div>
  );
}
