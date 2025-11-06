import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ExpenseDialog } from "@/components/Expenses/ExpenseDialog";
import { useExpenses, type Expense } from "@/hooks/useExpenses";
import { useAuth } from "@/contexts/AuthContext";
import StatsCard from "@/components/Dashboard/StatsCard";

const Expenses = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense, totalIncome, totalExpense, balance } = useExpenses();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();

  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    setSelectedExpense(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  const handleSave = (expenseData: Omit<Expense, "id" | "madrasa_name" | "created_at" | "updated_at">) => {
    if (selectedExpense) {
      updateExpense({ id: selectedExpense.id, ...expenseData });
    } else {
      addExpense(expenseData);
    }
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("expenses.title")}</h1>
          <p className="text-muted-foreground">{t("expenses.description")}</p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t("expenses.addTransaction")}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title={t("expenses.totalIncome")}
          value={totalIncome.toLocaleString()}
          icon={TrendingUp}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
        />
        <StatsCard
          title={t("expenses.totalExpense")}
          value={totalExpense.toLocaleString()}
          icon={TrendingDown}
          className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20"
        />
        <StatsCard
          title={t("expenses.balance")}
          value={balance.toLocaleString()}
          icon={Wallet}
          className={`bg-gradient-to-br ${
            balance >= 0
              ? "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
              : "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20"
          }`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("expenses.transactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder={t("expenses.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? t("expenses.noTransactionsFound") : t("expenses.noTransactions")}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("expenses.date")}</TableHead>
                    <TableHead>{t("expenses.title")}</TableHead>
                    <TableHead>{t("expenses.category")}</TableHead>
                    <TableHead>{t("expenses.type")}</TableHead>
                    <TableHead className="text-right">{t("expenses.amount")}</TableHead>
                    <TableHead>{t("expenses.paymentMethod")}</TableHead>
                    {isAdmin && <TableHead className="text-right">{t("common.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>
                        <Badge variant={expense.type === "income" ? "default" : "secondary"}>
                          {expense.type === "income" ? t("expenses.income") : t("expenses.expense")}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        expense.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {expense.type === "income" ? "+" : "-"}{expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{expense.payment_method || "-"}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(expense)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        expense={selectedExpense}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("expenses.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("expenses.deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
