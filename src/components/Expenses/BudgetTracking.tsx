import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBudgets, type Budget } from "@/hooks/useBudgets";
import { useExpenses } from "@/hooks/useExpenses";
import { BudgetDialog } from "./BudgetDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const BudgetTracking = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { budgets, isLoading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const currentBudgets = budgets.filter(
    (b) => b.month === currentMonth && b.year === currentYear
  );

  const getBudgetUsage = (budget: Budget) => {
    const spent = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          e.type === "expense" &&
          e.category === budget.category &&
          expenseDate.getMonth() + 1 === budget.month &&
          expenseDate.getFullYear() === budget.year
        );
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const percentage = (spent / Number(budget.amount)) * 100;
    const remaining = Number(budget.amount) - spent;

    return { spent, percentage, remaining };
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100) return { color: "destructive", icon: AlertTriangle, text: "exceeded" };
    if (percentage >= 80) return { color: "warning", icon: AlertTriangle, text: "warning" };
    return { color: "success", icon: CheckCircle2, text: "onTrack" };
  };

  const handleAddClick = () => {
    setSelectedBudget(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setDialogOpen(true);
  };

  const handleSave = (budgetData: Omit<Budget, "id" | "madrasa_name" | "created_at" | "updated_at">) => {
    if (selectedBudget) {
      updateBudget({ id: selectedBudget.id, ...budgetData });
    } else {
      addBudget(budgetData);
    }
  };

  const handleDeleteClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBudget) {
      deleteBudget(selectedBudget.id);
      setDeleteDialogOpen(false);
    }
  };

  const overBudgetCategories = currentBudgets.filter((b) => getBudgetUsage(b).percentage >= 100);
  const warningCategories = currentBudgets.filter(
    (b) => getBudgetUsage(b).percentage >= 80 && getBudgetUsage(b).percentage < 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("expenses.budget.title")}</h2>
          <p className="text-muted-foreground">{t("expenses.budget.description")}</p>
        </div>
        {isAdmin && (
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t("expenses.budget.set")}
          </Button>
        )}
      </div>

      {overBudgetCategories.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("expenses.budget.alertExceeded")}: {overBudgetCategories.map((b) => b.category).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {warningCategories.length > 0 && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            {t("expenses.budget.alertWarning")}: {warningCategories.map((b) => b.category).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">{t("common.loading")}</div>
      ) : currentBudgets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              {t("expenses.budget.noBudgets")}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentBudgets.map((budget) => {
            const { spent, percentage, remaining } = getBudgetUsage(budget);
            const status = getBudgetStatus(percentage);
            const StatusIcon = status.icon;

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(budget.year, budget.month - 1).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClick(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(budget)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("expenses.budget.spent")}</span>
                      <span className="font-medium">{spent.toLocaleString()}</span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("expenses.budget.budgetAmount")}</span>
                      <span className="font-medium">{Number(budget.amount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={status.color as any} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {t(`expenses.budget.status.${status.text}`)}
                    </Badge>
                    <span
                      className={`text-sm font-semibold ${
                        remaining >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {remaining >= 0 ? "+" : ""}
                      {remaining.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        budget={selectedBudget}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("expenses.budget.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("expenses.budget.deleteConfirmDescription")}
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
