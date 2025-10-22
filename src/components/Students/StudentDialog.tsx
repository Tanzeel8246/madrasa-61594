import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { studentSchema } from "@/lib/validations";
import { toast } from "sonner";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (student: Omit<Student, "id" | "created_at" | "updated_at">) => void;
  student?: Student;
}

export function StudentDialog({ open, onOpenChange, onSave, student }: StudentDialogProps) {
  const { classes } = useClasses();
  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    class_id: "",
    admission_date: new Date().toISOString().split('T')[0],
    contact: "",
    age: "",
    grade: "",
    status: "active",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        father_name: student.father_name,
        class_id: student.class_id || "",
        admission_date: student.admission_date,
        contact: student.contact || "",
        age: student.age?.toString() || "",
        grade: student.grade || "",
        status: student.status,
      });
    } else {
      setFormData({
        name: "",
        father_name: "",
        class_id: "",
        admission_date: new Date().toISOString().split('T')[0],
        contact: "",
        age: "",
        grade: "",
        status: "active",
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = studentSchema.parse({
        name: formData.name,
        father_name: formData.father_name,
        class_id: formData.class_id || null,
        admission_date: formData.admission_date,
        contact: formData.contact || '',
        age: formData.age ? parseInt(formData.age) : null,
        grade: formData.grade || '',
        status: formData.status,
      });
      
      onSave({
        name: validatedData.name,
        father_name: validatedData.father_name,
        class_id: validatedData.class_id || undefined,
        admission_date: validatedData.admission_date,
        contact: validatedData.contact || undefined,
        age: validatedData.age || undefined,
        grade: validatedData.grade || undefined,
        status: validatedData.status,
      });
      onOpenChange(false);
    } catch (error: any) {
      const firstError = error.errors?.[0];
      toast.error(firstError?.message || "Invalid form data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{student ? "Edit Student / طالب علم میں ترمیم" : "Add New Student / نیا طالب علم شامل کریں"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="name">Name / نام *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="father_name">Father's Name / والد کا نام *</Label>
            <Input
              id="father_name"
              value={formData.father_name}
              onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="class_id">Class / کلاس</Label>
            <Select value={formData.class_id || undefined} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
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
            <Label htmlFor="admission_date">Admission Date / داخلے کی تاریخ *</Label>
            <Input
              id="admission_date"
              type="date"
              value={formData.admission_date}
              onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact / رابطہ</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="age">Age / عمر</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="grade">Grade / درجہ</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Status / حیثیت</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active / فعال</SelectItem>
                <SelectItem value="inactive">Inactive / غیر فعال</SelectItem>
                <SelectItem value="graduated">Graduated / فارغ التحصیل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel / منسوخ
            </Button>
            <Button type="submit" className="w-full sm:w-auto">Save / محفوظ کریں</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}