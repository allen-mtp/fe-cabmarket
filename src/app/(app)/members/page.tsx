"use client";

import * as React from "react";
import { Loader2, Plus, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/use-members";

export default function MembersPage() {
  const { members, status, saveMembers } = useMembers();
  const [list, setList] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setList(members);
  }, [members]);

  const dirty =
    list.length !== members.length || list.some((m, i) => m !== members[i]);

  const addMember = () => {
    const name = draft.trim();
    if (!name) return;
    if (name.length > 30) {
      toast.error("Tên không quá 30 ký tự");
      return;
    }
    if (list.some((m) => m.toLowerCase() === name.toLowerCase())) {
      toast.error("Tên này đã có trong danh sách");
      return;
    }
    if (list.length >= 30) {
      toast.error("Tối đa 30 thành viên");
      return;
    }
    setList([...list, name]);
    setDraft("");
  };

  const removeMember = (name: string) => {
    setList(list.filter((m) => m !== name));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMembers(list);
      toast.success("Đã lưu danh sách thành viên");
    } catch {
      toast.error("Không thể lưu, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Thành viên
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý danh sách người hay đi cùng để chia tiền nhanh hơn.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Danh sách
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Những người này sẽ hiện ở mục &ldquo;Người trả&rdquo; và
            &ldquo;Người đi&rdquo; khi bạn chia tiền taxi hoặc sinh hoạt.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tên, ví dụ: An, Bình, Châu..."
              value={draft}
              maxLength={30}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMember();
                }
              }}
            />
            <Button
              type="button"
              onClick={addMember}
              disabled={!draft.trim()}
              className="shrink-0 gap-1.5 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
          </div>

          {status === "loading" ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
              Chưa có thành viên nào. Thêm vài người ở trên để bắt đầu.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {list.map((m) => (
                <span
                  key={m}
                  className="inline-flex animate-slide-in-right items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-taxi/30 hover:shadow-md"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => removeMember(m)}
                    aria-label={`Xóa ${m}`}
                    className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{list.length}</span>{" "}
              thành viên
            </p>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving}
              className="gap-2 rounded-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}