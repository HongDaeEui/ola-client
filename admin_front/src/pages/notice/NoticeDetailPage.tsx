import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BaseVerticalTable, VerticalRowDef } from "@/components/common/BaseVerticalTable.tsx";
import BaseButton from "@/components/common/BaseButton.tsx";
import ConfirmDialog from "@/components/common/ConfirmDialog.tsx";
import { useNoticeStore } from "@/stores/notice_store.ts";
import { toast } from "sonner";
import { formatTDate } from "@/lib/formatDate.ts";
import { Notice } from "@/models/notice.ts";

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDetail, update, remove, loading } = useNoticeStore();

  const [data, setData] = useState<Notice | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [formData, setFormData] = useState<Partial<Notice>>({});
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
        title: formData.title || data?.title || '',
        content: formData.content || data?.content || '',
        author: formData.author || data?.author || '',
        isPublished: formData.isPublished !== undefined ? formData.isPublished : data?.isPublished || false,
        isPinned: formData.isPinned !== undefined ? formData.isPinned : data?.isPinned || false,
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
        navigate("/notice");
      }
    } catch {
      toast.error("Failed to delete.");
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
            <BaseButton label="List" color="black" width="60px" onClick={() => navigate("/notice")} />
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
        description={`"${data?.title}" will be deleted. This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Confirm"
      />
    </div>
  );
}
