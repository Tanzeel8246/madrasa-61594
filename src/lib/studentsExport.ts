import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Student } from "@/hooks/useStudents";

interface ExportStudentsData {
  students: Student[];
  madrasaName: string;
  classes?: any[];
}

export const exportStudentsToPDF = async ({ students, madrasaName, classes }: ExportStudentsData) => {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for better table layout
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;

  // Helper function to get class name
  const getClassName = (classId?: string) => {
    if (!classId || !classes) return "N/A";
    const cls = classes.find(c => c.id === classId);
    return cls?.name || "N/A";
  };

  // Header - Madrasa Name and Report Type
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(madrasaName || "Madrasa Name", pageWidth / 2, 15, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("فہرست طلبہ / Students List", pageWidth / 2, 23, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} - ${new Date().toLocaleTimeString('en-GB')}`, pageWidth / 2, 29, { align: "center" });

  // Prepare table data - Right to Left for Urdu
  const tableData = students.map((student, index) => [
    (index + 1).toString(), // نمبر شمار
    student.name, // نام طالبعلم
    student.father_name, // والد کا نام
    student.age ? student.age.toString() : 'N/A', // عمر
    getClassName(student.class_id), // جماعت
    new Date(student.admission_date).toLocaleDateString('en-GB'), // تاریخ داخلہ
    student.contact || 'N/A', // موبائل نمبر
    student.grade || 'N/A', // گریڈ
    student.status === 'active' ? 'فعال' : 'غیر فعال', // حیثیت
  ]);

  // Draw table with Urdu headers (Right to Left)
  autoTable(doc, {
    startY: 35,
    head: [[
      'خلاصہ بجٹ', // Remarks/Budget
      'سابقہ نام', // Previous Name/Status
      'اضافہ نام', // Additional Name/Grade
      'شناختی نمبر', // ID Number/Contact
      'تاریخ داخلہ', // Admission Date
      'جماعت', // Class
      'عمر', // Age
      'والد کا نام', // Father Name
      'نام طالبعلم', // Student Name
      'نمبر شمار', // Serial Number
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 2,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 22 }, // نمبر شمار
      1: { cellWidth: 35 }, // نام طالبعلم
      2: { cellWidth: 35 }, // والد کا نام
      3: { cellWidth: 18 }, // عمر
      4: { cellWidth: 25 }, // جماعت
      5: { cellWidth: 28 }, // تاریخ داخلہ
      6: { cellWidth: 30 }, // موبائل نمبر
      7: { cellWidth: 25 }, // گریڈ
      8: { cellWidth: 25 }, // حیثیت
    },
    margin: { left: margin, right: margin },
    didDrawPage: function(data) {
      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const footerText = `Imam Tools Suite - صفحہ ${doc.getCurrentPageInfo().pageNumber}`;
      doc.text(
        footerText,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: "center" }
      );
    }
  });

  // Save the PDF
  const fileName = `Students_List_${madrasaName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};