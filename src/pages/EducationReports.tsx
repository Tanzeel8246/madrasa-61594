import { useState } from "react";
import { Plus, Search, FileText, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEducationReports, EducationReport } from "@/hooks/useEducationReports";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { EducationReportDialog } from "@/components/EducationReports/EducationReportDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { exportEducationReportsToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";

export default function EducationReports() {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<EducationReport | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  const { reports, isLoading, addReport, updateReport, deleteReport } = useEducationReports();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { classes } = useClasses();

  const filteredReports = reports.filter((report) => {
    const student = students.find(s => s.id === report.student_id);
    return student?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddClick = () => {
    setEditingReport(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (report: EducationReport) => {
    setEditingReport(report);
    setDialogOpen(true);
  };

  const handleSave = (reportData: Omit<EducationReport, "id" | "created_at" | "updated_at">) => {
    if (editingReport) {
      updateReport({ id: editingReport.id, ...reportData });
    } else {
      addReport(reportData);
    }
  };

  const handleDeleteClick = (id: string) => {
    setReportToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown Student";
  };

  const getClassName = (classId?: string) => {
    if (!classId) return "No Class";
    const cls = classes.find(c => c.id === classId);
    return cls?.name || "Unknown Class";
  };

  const handleExportPDF = async () => {
    if (filteredReports.length === 0) {
      toast.error("No reports to export");
      return;
    }

    try {
      toast.info("Generating PDF...");
      await exportEducationReportsToPDF({
        reports: filteredReports,
        students,
        classes,
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Learning Report / تعلیمی رپورٹ
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Track Qur'an learning progress</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleAddClick} disabled={!isAdmin}>
          <Plus className="h-4 w-4" />
          Add Report / رپورٹ شامل کریں
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.id} className="shadow-elevated hover:shadow-elevated transition-all duration-300 sm:hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{getStudentName(report.student_id)}</span>
                    <Badge variant="outline">{new Date(report.date).toLocaleDateString()}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Father: {report.father_name} | Class: {getClassName(report.class_id)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sabak Section */}
                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <h4 className="font-semibold text-sm">Sabak / سبق</h4>
                    <p className="text-sm">Para: {report.sabak?.para_no || 'N/A'}</p>
                    <p className="text-sm">Amount: {report.sabak?.amount || 'N/A'}</p>
                  </div>

                  {/* Sabqi Section */}
                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <h4 className="font-semibold text-sm">Sabqi / سبقی</h4>
                    <p className="text-sm">
                      Recited: {report.sabqi?.recited ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm">Amount: {report.sabqi?.amount || 'N/A'}</p>
                  </div>

                  {/* Manzil Section */}
                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <h4 className="font-semibold text-sm">Manzil / منزل</h4>
                    <p className="text-sm">Number: {report.manzil?.number || 'N/A'}</p>
                  </div>

                  {report.remarks && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{report.remarks}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {isAdmin && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(report)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(report.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reports found matching your search.</p>
            </div>
          )}
        </div>
      )}

      <EducationReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        report={editingReport}
        students={students}
        teachers={teachers}
        classes={classes}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the education report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}