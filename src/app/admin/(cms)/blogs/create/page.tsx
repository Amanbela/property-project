import { BlogCreateForm } from "@/components/admin/BlogCreateForm";
import { BlogJsonImportTab } from "@/components/admin/BlogJsonImportTab";
import { CreatePageTabs } from "@/components/admin/CreatePageTabs";

export default function AdminBlogCreatePage() {
  return (
    <CreatePageTabs
      formEntry={<BlogCreateForm />}
      jsonImport={<BlogJsonImportTab />}
    />
  );
}
