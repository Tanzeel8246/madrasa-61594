import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Attendance } from "@/hooks/useAttendance";
import { Student } from "@/hooks/useStudents";
import { Class } from "@/hooks/useClasses";

interface ExportData {
  attendance: Attendance[];
  students: Student[];
  classes: Class[];
  dateRange?: { start: string; end: string };
  madrasaName?: string;
}

export const exportAttendanceToPDF = async ({ 
  attendance, 
  students, 
  classes, 
  dateRange,
  madrasaName 
}: ExportData) => {
  const doc = new jsPDF('l', 'mm', 'a4');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  const getStudentName = (studentId?: string) => {
    if (!studentId) return "N/A";
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown";
  };

  const getClassName = (classId?: string) => {
    if (!classId) return "N/A";
    const cls = classes.find(c => c.id === classId);
    return cls?.name || "N/A";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "present": return "حاضر / Present";
      case "absent": return "غیر حاضر / Absent";
      case "late": return "دیر / Late";
      case "excused": return "چھٹی / Excused";
      default: return status;
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(madrasaName || "Madrasa Name", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("حاضری رپورٹ / Attendance Report", pageWidth / 2, 23, { align: "center" });
  
  if (dateRange) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Period: ${new Date(dateRange.start).toLocaleDateString('en-GB')} - ${new Date(dateRange.end).toLocaleDateString('en-GB')}`,
      pageWidth / 2,
      29,
      { align: "center" }
    );
  }

  doc.setFontSize(9);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-GB')} - ${new Date().toLocaleTimeString('en-GB')}`,
    pageWidth / 2,
    35,
    { align: "center" }
  );

  // Group by date and class for better organization
  const sortedAttendance = [...attendance].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Summary statistics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === "present").length;
  const absentCount = attendance.filter(a => a.status === "absent").length;
  const lateCount = attendance.filter(a => a.status === "late").length;
  const excusedCount = attendance.filter(a => a.status === "excused").length;

  let startY = 42;

  // Summary box
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Summary / خلاصہ:", margin, startY);
  
  startY += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Records: ${totalRecords} | Present: ${presentCount} | Absent: ${absentCount} | Late: ${lateCount} | Excused: ${excusedCount}`, margin, startY);
  
  startY += 8;

  // Table data
  const tableData = sortedAttendance.map(record => [
    new Date(record.date).toLocaleDateString('en-GB'),
    getStudentName(record.student_id),
    getClassName(record.class_id),
    record.time || '-',
    getStatusText(record.status),
    record.noted_by || '-'
  ]);

  // Draw table
  autoTable(doc, {
    startY: startY,
    head: [['تاریخ / Date', 'طالب علم / Student', 'کلاس / Class', 'Time', 'Status', 'Noted By']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 35, halign: 'center' },
      5: { cellWidth: 'auto' }
    },
    margin: { left: margin, right: margin },
    didDrawPage: function(data) {
      // Footer
      doc.setFontSize(7);
      doc.text(
        `Imam Tools Suite - صفحہ ${doc.getCurrentPageInfo().pageNumber}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: "center" }
      );
    }
  });

  // Save the PDF
  const fileName = `Attendance_Report_${dateRange ? `${dateRange.start}_to_${dateRange.end}` : 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};