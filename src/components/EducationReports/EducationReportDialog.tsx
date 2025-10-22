import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EducationReport } from "@/hooks/useEducationReports";
import { Student } from "@/hooks/useStudents";
import { Teacher } from "@/hooks/useTeachers";
import { Class } from "@/hooks/useClasses";
import { toast } from "sonner";

interface EducationReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (report: Omit<EducationReport, "id" | "created_at" | "updated_at">) => void;
  report?: EducationReport;
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
}

export function EducationReportDialog({
  open,
  onOpenChange,
  onSave,
  report,
  students,
  teachers,
  classes,
}: EducationReportDialogProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    father_name: "",
    class_id: "",
    date: new Date().toISOString().split('T')[0],
    sabak_para_no: "",
    sabak_amount: "",
    sabqi_recited: false,
    sabqi_amount: "",
    sabqi_heard_by: "",
    manzil_number: "",
    manzil_heard_by: "",
    remarks: "",
  });

  useEffect(() => {
    if (report) {
      setFormData({
        student_id: report.student_id,
        father_name: report.father_name,
        class_id: report.class_id || "",
        date: report.date,
        sabak_para_no: report.sabak?.para_no?.toString() || "",
        sabak_amount: report.sabak?.amount || "",
        sabqi_recited: report.sabqi?.recited || false,
        sabqi_amount: report.sabqi?.amount || "",
        sabqi_heard_by: report.sabqi?.heard_by || "",
        manzil_number: report.manzil?.number || "",
        manzil_heard_by: report.manzil?.heard_by || "",
        remarks: report.remarks || "",
      });
    } else {
      setFormData({
        student_id: "",
        father_name: "",
        class_id: "",
        date: new Date().toISOString().split('T')[0],
        sabak_para_no: "",
        sabak_amount: "",
        sabqi_recited: false,
        sabqi_amount: "",
        sabqi_heard_by: "",
        manzil_number: "",
        manzil_heard_by: "",
        remarks: "",
      });
    }
  }, [report, open]);

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setFormData({
        ...formData,
        student_id: studentId,
        father_name: student.father_name,
        class_id: student.class_id || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id) {
      toast.error("Please select a student");
      return;
    }

    onSave({
      student_id: formData.student_id,
      father_name: formData.father_name,
      class_id: formData.class_id || undefined,
      date: formData.date,
      sabak: {
        para_no: formData.sabak_para_no ? parseInt(formData.sabak_para_no) : undefined,
        amount: formData.sabak_amount || undefined,
      },
      sabqi: {
        recited: formData.sabqi_recited,
        amount: formData.sabqi_amount || undefined,
        heard_by: formData.sabqi_heard_by || undefined,
      },
      manzil: {
        number: formData.manzil_number || undefined,
        heard_by: formData.manzil_heard_by || undefined,
      },
      remarks: formData.remarks || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {report ? "Edit Education Report / رپورٹ میں ترمیم" : "Add Education Report / نئی رپورٹ شامل کریں"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Student Information / طالب علم کی معلومات</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_id">Student / طالب علم *</Label>
                <Select value={formData.student_id} onValueChange={handleStudentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="father_name">Father's Name / والد کا نام</Label>
                <Input
                  id="father_name"
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="class_id">Class / کلاس</Label>
                <Select value={formData.class_id} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.section ? `- ${cls.section}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date / تاریخ *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sabak Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Sabak / سبق</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sabak_para_no">Para Number / پارہ نمبر (1-30)</Label>
                <Input
                  id="sabak_para_no"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.sabak_para_no}
                  onChange={(e) => setFormData({ ...formData, sabak_para_no: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sabak_amount">Amount / مقدار</Label>
                <Input
                  id="sabak_amount"
                  value={formData.sabak_amount}
                  onChange={(e) => setFormData({ ...formData, sabak_amount: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Sabqi Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Sabqi / سبقی</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="sabqi_recited"
                checked={formData.sabqi_recited}
                onCheckedChange={(checked) => setFormData({ ...formData, sabqi_recited: checked as boolean })}
              />
              <Label htmlFor="sabqi_recited">Recited / سنایا</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sabqi_amount">Amount / مقدار</Label>
                <Input
                  id="sabqi_amount"
                  value={formData.sabqi_amount}
                  onChange={(e) => setFormData({ ...formData, sabqi_amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sabqi_heard_by">Heard By / سنا</Label>
                <Select value={formData.sabqi_heard_by} onValueChange={(value) => setFormData({ ...formData, sabqi_heard_by: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Manzil Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Manzil / منزل</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manzil_number">Manzil Number / منزل نمبر</Label>
                <Input
                  id="manzil_number"
                  value={formData.manzil_number}
                  onChange={(e) => setFormData({ ...formData, manzil_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="manzil_heard_by">Heard By / سنا</Label>
                <Select value={formData.manzil_heard_by} onValueChange={(value) => setFormData({ ...formData, manzil_heard_by: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <Label htmlFor="remarks">Remarks / تبصرہ</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel / منسوخ
            </Button>
            <Button type="submit">Save / محفوظ کریں</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}