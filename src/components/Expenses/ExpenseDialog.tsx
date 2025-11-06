import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { Expense } from "@/hooks/useExpenses";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<Expense, "id" | "madrasa_name" | "created_at" | "updated_at">) => void;
  expense?: Expense;
}

const categories = {
  income: ["Donations", "Fees", "Grants", "Other Income"],
  expense: ["Salaries", "Utilities", "Maintenance", "Supplies", "Food", "Transport", "Other Expense"],
};

export const ExpenseDialog = ({ open, onOpenChange, onSave, expense }: ExpenseDialogProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    payment_method: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        description: expense.description || "",
        amount: expense.amount.toString(),
        type: expense.type,
        category: expense.category,
        date: expense.date,
        payment_method: expense.payment_method || "",
      });
    } else if (open) {
      setFormData({
        title: "",
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "",
      });
    }
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
    } as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? t("expenses.editTransaction") : t("expenses.addTransaction")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t("expenses.type")}</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "income" | "expense") => {
                setFormData({ ...formData, type: value, category: "" });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">{t("expenses.income")}</SelectItem>
                <SelectItem value="expense">{t("expenses.expense")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{t("expenses.title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t("expenses.category")}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t("expenses.amount")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t("expenses.date")}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">{t("expenses.paymentMethod")}</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("expenses.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
