"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AmountField,
  DateField,
  NoteField,
  ParticipantsField,
  PayerField,
  SessionField,
} from "@/components/transactions/form-fields";
import { SplitPreview } from "@/components/transactions/split-preview";
import {
  transactionSchema,
  type TransactionFormValues,
} from "@/lib/validations/transaction";
import type { ApiError, Category, Transaction } from "@/types";
import { transactionsApi } from "@/lib/api";
import { useMembers } from "@/hooks/use-members";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
}

const DEFAULT_VALUES: TransactionFormValues = {
  amount: 0,
  category: "taxi",
  date: new Date().toISOString().slice(0, 10),
  payer: "",
  participants: [],
  session: "sang",
  note: "",
};

function toFormValues(t: Transaction): TransactionFormValues {
  return {
    amount: t.amount,
    category: t.category,
    date: t.date.slice(0, 10),
    payer: t.payer ?? "",
    participants: t.participants ?? [],
    session: t.session ?? "sang",
    note: t.note ?? "",
  };
}

const TABS: { value: Category; label: string; icon: typeof Car }[] = [
  { value: "taxi", label: "Taxi", icon: Car },
  { value: "market", label: "Sinh hoạt", icon: ShoppingCart },
];

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const isEdit = !!transaction;
  const [submitting, setSubmitting] = React.useState(false);
  const { members, saveMembers } = useMembers();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? toFormValues(transaction) : DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const category = watch("category");
  const amount = watch("amount");
  const participants = watch("participants");
  const payer = watch("payer");

  const seededRef = React.useRef(false);
  React.useEffect(() => {
    if (!isEdit && !seededRef.current && members.length > 0) {
      seededRef.current = true;
      setValue("participants", [...members]);
    }
  }, [isEdit, members, setValue]);

  const handleAddMember = async (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    const existing = members.find((m) => m.toLowerCase() === name.toLowerCase());
    const finalName = existing ?? name;

    if (!existing) {
      try {
        await saveMembers([...members, name]);
      } catch {
        toast.error("Không thể thêm người, vui lòng thử lại");
        return;
      }
    }

    const current = getValues("participants");
    if (!current.includes(finalName)) {
      setValue("participants", [...current, finalName]);
    }
  };

  const onSubmit = async (values: TransactionFormValues) => {
    setSubmitting(true);
    const payload = {
      amount: values.amount,
      category: values.category,
      date: values.date,
      payer: values.payer,
      participants: values.participants,
      session: values.category === "taxi" ? values.session : undefined,
      note: values.category === "market" ? values.note?.trim() : undefined,
    };
    try {
      if (isEdit && transaction) {
        const updated = await transactionsApi.update(transaction.id, payload);
        toast.success("Đã cập nhật khoản chia");
        onSuccess?.(updated);
      } else {
        const created = await transactionsApi.create(payload);
        toast.success("Đã lưu khoản chia tiền");
        reset({ ...DEFAULT_VALUES, participants: [...members] });
        onSuccess?.(created);
      }
    } catch (e) {
      const err = e as ApiError;
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-muted/60 p-1.5">
            {TABS.map((tab) => {
              const active = field.value === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => field.onChange(tab.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200",
                    active
                      ? tab.value === "taxi"
                        ? "bg-background text-taxi shadow-sm ring-1 ring-taxi/10"
                        : "bg-background text-market shadow-sm ring-1 ring-market/10"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DateField
              value={field.value}
              onChange={field.onChange}
              error={errors.date?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="payer"
          render={({ field }) => (
            <PayerField
              value={field.value}
              onChange={field.onChange}
              members={members}
              error={errors.payer?.message}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <AmountField
            value={field.value}
            onChange={field.onChange}
            error={errors.amount?.message}
          />
        )}
      />

      {category === "taxi" && (
        <Controller
          control={control}
          name="session"
          render={({ field }) => (
            <SessionField
              value={field.value}
              onChange={field.onChange}
              error={errors.session?.message}
            />
          )}
        />
      )}

      {category === "market" && (
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <NoteField
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.note?.message}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="participants"
        render={({ field }) => (
          <ParticipantsField
            value={field.value}
            onChange={field.onChange}
            members={members}
            accent={category}
            onAddMember={handleAddMember}
            error={errors.participants?.message}
          />
        )}
      />

      <SplitPreview
        amount={amount}
        participants={participants}
        payer={payer}
        accent={category}
      />

      <Separator />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg"
        >
          Hủy
        </Button>
        <Button type="submit" disabled={submitting} className="gap-2 rounded-lg">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEdit ? (
            "Cập nhật"
          ) : (
            "Lưu khoản chia"
          )}
        </Button>
      </div>
    </form>
  );
}