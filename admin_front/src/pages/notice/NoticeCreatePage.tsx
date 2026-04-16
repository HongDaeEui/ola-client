import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import { useNoticeStore } from "@/stores/notice_store.ts";
import { toast } from "sonner";
import { NoticeRequest } from "@/models/notice.ts";

export default function NoticeCreatePage() {
  const navigate = useNavigate();
  const { add } = useNoticeStore();

  const [formData, setFormData] = useState<Partial<NoticeRequest>>({
    isPublished: false,
    isPinned: false,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Please enter a title.");
      return;
    }
    if (!formData.author) {
      toast.error("Please enter an author.");
      return;
    }

    try {
      const success = await add({
        title: formData.title || '',
        content: formData.content || '',
        author: formData.author || '',
        isPublished: formData.isPublished || false,
        isPinned: formData.isPinned || false,
      });

      if (success) {
        toast.success("Created successfully.");
        navigate("/notice");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const rows: VerticalRowDef[] = [
    { label: "Title", key: "title", type: "text" },
    { label: "Content", key: "content", type: "textarea" },
    { label: "Author", key: "author", type: "text" },
    {
      label: "Published", key: "isPublished",
      type: "toggle",
      toggleOptions: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    {
      label: "Pinned", key: "isPinned",
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
        <BaseButton label="Cancel" color="black" width="72px" onClick={() => navigate("/notice")} />
        <BaseButton label="Create" color="blue" width="92px" onClick={handleSave} />
      </div>
    </div>
  );
}
