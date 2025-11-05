import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { useAttendance } from "@/hooks/useAttendance";
import { useEducationReports } from "@/hooks/useEducationReports";
import { useFees } from "@/hooks/useFees";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { exportEducationReportsToPDF } from "@/lib/pdfExport";
import { exportAttendanceToPDF } from "@/lib/attendanceExport";
import { exportFeesToPDF } from "@/lib/feesExport";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subMonths, startOfYear, endOfYear } from "date-fns";

type ReportType = "education" | "attendance" | "fees";
type DateFilter = "week" | "month" | "quarter" | "half" | "year" | "all";

export default function Reports() {
  const { t } = useTranslation();
  const { madrasaName } = useAuth();
  const [reportType, setReportType] = useState<ReportType>("education");
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { classes } = useClasses();
  const { attendance } = useAttendance();
  const { reports } = useEducationReports();
  const { fees } = useFees();

  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    switch (filter) {
      case "week":
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "quarter":
        return { start: startOfQuarter(now), end: endOfQuarter(now) };
      case "half":
        return { start: startOfMonth(subMonths(now, 6)), end: endOfMonth(now) };
      case "year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return null;
    }
  };

  const filterDataByDate = <T extends { date?: string; due_date?: string; created_at?: string }>(
    data: T[],
    dateField: keyof T = 'date' as keyof T
  ) => {
    const range = getDateRange(dateFilter);
    if (!range || dateFilter === "all") return data;

    return data.filter(item => {
      const dateValue = item[dateField] as string;
      if (!dateValue) return false;
      const itemDate = new Date(dateValue);
      return itemDate >= range.start && itemDate <= range.end;
    });
  };

  const filterDataByStudent = <T extends { student_id?: string }>(data: T[]) => {
    if (selectedStudent === "all") return data;
    return data.filter(item => item.student_id === selectedStudent);
  };

  const filterDataByClass = <T extends { class_id?: string }>(data: T[]) => {
    if (selectedClass === "all") return data;
    return data.filter(item => item.class_id === selectedClass);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      let filteredData: any;
      const range = getDateRange(dateFilter);

      switch (reportType) {
        case "education":
          filteredData = filterDataByStudent(
            filterDataByClass(
              filterDataByDate(reports || [], 'date')
            )
          );
          
          if (filteredData.length === 0) {
            toast.error("No education reports found for the selected filters");
            return;
          }

          await exportEducationReportsToPDF({
            reports: filteredData,
            students: students || [],
            classes: classes || [],
            teachers: teachers || [],
            dateFilter,
            madrasaName: madrasaName || undefined,
          });
          toast.success("Education report generated successfully");
          break;

        case "attendance":
          filteredData = filterDataByStudent(
            filterDataByClass(
              filterDataByDate(attendance || [], 'date')
            )
          );

          if (filteredData.length === 0) {
            toast.error("No attendance records found for the selected filters");
            return;
          }

          await exportAttendanceToPDF({
            attendance: filteredData,
            students: students || [],
            classes: classes || [],
            dateRange: range ? {
              start: range.start.toISOString().split('T')[0],
              end: range.end.toISOString().split('T')[0]
            } : undefined,
            madrasaName: madrasaName || undefined,
          });
          toast.success("Attendance report generated successfully");
          break;

        case "fees":
          filteredData = filterDataByStudent(
            filterDataByDate(fees || [], 'due_date')
          );

          if (filteredData.length === 0) {
            toast.error("No fee records found for the selected filters");
            return;
          }

          await exportFeesToPDF({
            fees: filteredData,
            students: students || [],
            dateRange: range ? {
              start: range.start.toISOString().split('T')[0],
              end: range.end.toISOString().split('T')[0]
            } : undefined,
            madrasaName: madrasaName || undefined,
          });
          toast.success("Financial report generated successfully");
          break;
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportStats = () => {
    let filteredData: any[];
    switch (reportType) {
      case "education":
        filteredData = filterDataByStudent(
          filterDataByClass(
            filterDataByDate(reports || [], 'date')
          )
        );
        return {
          total: filteredData.length,
          description: `${filteredData.length} education report(s) match your filters`
        };
      case "attendance":
        filteredData = filterDataByStudent(
          filterDataByClass(
            filterDataByDate(attendance || [], 'date')
          )
        );
        const present = filteredData.filter(a => a.status === "present").length;
        const absent = filteredData.filter(a => a.status === "absent").length;
        return {
          total: filteredData.length,
          description: `${filteredData.length} record(s) - ${present} present, ${absent} absent`
        };
      case "fees":
        filteredData = filterDataByStudent(
          filterDataByDate(fees || [], 'due_date')
        );
        const totalAmount = filteredData.reduce((sum, fee) => sum + Number(fee.amount), 0);
        const paid = filteredData.filter(f => f.status === "paid").length;
        return {
          total: filteredData.length,
          description: `${filteredData.length} fee record(s) - Rs. ${totalAmount.toLocaleString()} total, ${paid} paid`
        };
      default:
        return { total: 0, description: "" };
    }
  };

  const stats = getReportStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('reports.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Education Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total records available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total records available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fee Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fees?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total records available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Select filters and generate a comprehensive PDF report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education Reports</SelectItem>
                  <SelectItem value="attendance">Attendance Reports</SelectItem>
                  <SelectItem value="fees">Financial Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="half">Last 6 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Student
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reportType !== "fees" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">{stats.total} records match your filters</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.description}</p>
            </div>
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating || stats.total === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}