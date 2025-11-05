import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Fee } from "@/hooks/useFees";
import { Student } from "@/hooks/useStudents";

interface ExportData {
  fees: Fee[];
  students: Student[];
  dateRange?: { start: string; end: string };
  madrasaName?: string;
}

export const exportFeesToPDF = async ({ 
  fees, 
  students, 
  dateRange,
  madrasaName 
}: ExportData) => {
  const doc = new jsPDF('l', 'mm', 'a4');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown";
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "ادا شدہ / Paid";
      case "pending": return "زیر التواء / Pending";
      case "overdue": return "مقررہ تاریخ گزر گئی / Overdue";
      case "partial": return "جزوی / Partial";
      default: return status;
    }
  };

  const getStatusColor = (status: string): [number, number, number] => {
    switch (status) {
      case "paid": return [34, 197, 94]; // green
      case "pending": return [234, 179, 8]; // yellow
      case "overdue": return [239, 68, 68]; // red
      case "partial": return [59, 130, 246]; // blue
      default: return [128, 128, 128]; // gray
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(madrasaName || "Madrasa Name", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("مالیاتی رپورٹ / Financial Report", pageWidth / 2, 23, { align: "center" });
  
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

  // Calculate summary statistics
  const totalAmount = fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
  const paidAmount = fees
    .filter(f => f.status === "paid")
    .reduce((sum, fee) => sum + Number(fee.amount), 0);
  const pendingAmount = fees
    .filter(f => f.status === "pending" || f.status === "overdue")
    .reduce((sum, fee) => sum + Number(fee.amount), 0);
  
  const paidCount = fees.filter(f => f.status === "paid").length;
  const pendingCount = fees.filter(f => f.status === "pending").length;
  const overdueCount = fees.filter(f => f.status === "overdue").length;
  const partialCount = fees.filter(f => f.status === "partial").length;

  let startY = 42;

  // Summary box
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Summary / مالیاتی خلاصہ:", margin, startY);
  
  startY += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Amount: Rs. ${totalAmount.toLocaleString()} | Collected: Rs. ${paidAmount.toLocaleString()} | Pending: Rs. ${pendingAmount.toLocaleString()}`, margin, startY);
  
  startY += 5;
  doc.text(`Paid: ${paidCount} | Pending: ${pendingCount} | Overdue: ${overdueCount} | Partial: ${partialCount}`, margin, startY);
  
  startY += 8;

  // Sort fees by due date
  const sortedFees = [...fees].sort((a, b) => 
    new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
  );

  // Table data
  const tableData = sortedFees.map(fee => [
    getStudentName(fee.student_id),
    fee.fee_type,
    fee.academic_year,
    `Rs. ${Number(fee.amount).toLocaleString()}`,
    new Date(fee.due_date).toLocaleDateString('en-GB'),
    getStatusText(fee.status)
  ]);

  // Draw table
  autoTable(doc, {
    startY: startY,
    head: [['طالب علم / Student', 'Type', 'Academic Year', 'Amount', 'Due Date', 'Status']],
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
      0: { cellWidth: 50 },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 'auto', halign: 'center' }
    },
    margin: { left: margin, right: margin },
    didDrawCell: function(data) {
      // Color code the status column
      if (data.section === 'body' && data.column.index === 5) {
        const fee = sortedFees[data.row.index];
        const color = getStatusColor(fee.status);
        doc.setTextColor(color[0], color[1], color[2]);
      }
    },
    didDrawPage: function(data) {
      // Reset text color
      doc.setTextColor(0, 0, 0);
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
  const fileName = `Financial_Report_${dateRange ? `${dateRange.start}_to_${dateRange.end}` : 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};