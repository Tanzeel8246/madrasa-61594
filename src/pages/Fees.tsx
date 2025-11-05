import { useState } from "react";
import { Search, Plus, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useFees, Fee } from "@/hooks/useFees";
import { FeeDialog } from "@/components/Fees/FeeDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

export default function Fees() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<string | null>(null);

  const { fees, isLoading, createFee, updateFee, deleteFee } = useFees();

  const filteredFees = fees?.filter((fee) =>
    fee.fee_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.academic_year.includes(searchQuery)
  ) || [];

  const handleEdit = (fee: Fee) => {
    setEditingFee(fee);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (feeToDelete) {
      await deleteFee.mutateAsync(feeToDelete);
      setDeleteDialogOpen(false);
      setFeeToDelete(null);
    }
  };

  const canManageFees = isAdmin;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">{t('paid')}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">{t('pending')}</Badge>;
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">{t('overdue')}</Badge>;
      case "partial":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">{t('partial')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('feeManagement')}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t('manageFees')}</p>
        </div>
        {canManageFees && (
          <Button onClick={() => { setEditingFee(undefined); setDialogOpen(true); }} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> {t('addFee')}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg md:text-xl">{t('allFees')}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchFees')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t('loading')}</div>
          ) : filteredFees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noFeesFound')}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">{t('feeType')}</TableHead>
                    <TableHead className="min-w-[100px]">{t('academicYear')}</TableHead>
                    <TableHead className="min-w-[100px]">{t('amount')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('dueDate')}</TableHead>
                    <TableHead className="min-w-[100px]">{t('status')}</TableHead>
                    {canManageFees && <TableHead className="text-right min-w-[150px]">{t('actions')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.fee_type}</TableCell>
                      <TableCell>{fee.academic_year}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {fee.amount}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(fee.due_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(fee.status)}</TableCell>
                      {canManageFees && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(fee)}
                            className="mr-2"
                          >
                            {t('edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFeeToDelete(fee.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            {t('delete')}
                          </Button>
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

      <FeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fee={editingFee}
        onSave={async (data) => {
          if (editingFee) {
            await updateFee.mutateAsync({ id: editingFee.id, ...data });
          } else {
            await createFee.mutateAsync(data);
          }
          setDialogOpen(false);
          setEditingFee(undefined);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteFeeWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
