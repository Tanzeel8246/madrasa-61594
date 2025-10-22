import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Teacher } from "@/hooks/useTeachers";
import { teacherSchema } from "@/lib/validations";
import { toast } from "sonner";

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) => void;
  teacher?: Teacher;
}

export function TeacherDialog({ open, onOpenChange, onSave, teacher }: TeacherDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    subject: "",
    contact: "",
    email: "",
    specialization: "",
    classes_count: 0,
    students_count: 0,
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        qualification: teacher.qualification,
        subject: teacher.subject,
        contact: teacher.contact,
        email: teacher.email,
        specialization: teacher.specialization || "",
        classes_count: teacher.classes_count,
        students_count: teacher.students_count,
      });
    } else {
      setFormData({
        name: "",
        qualification: "",
        subject: "",
        contact: "",
        email: "",
        specialization: "",
        classes_count: 0,
        students_count: 0,
      });
    }
  }, [teacher, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = teacherSchema.parse({
        name: formData.name,
        qualification: formData.qualification,
        subject: formData.subject,
        contact: formData.contact,
        email: formData.email,
        specialization: formData.specialization || '',
      });
      
      onSave({
        name: validatedData.name,
        qualification: validatedData.qualification,
        subject: validatedData.subject,
        contact: validatedData.contact,
        email: validatedData.email,
        specialization: validatedData.specialization || undefined,
        classes_count: formData.classes_count,
        students_count: formData.students_count,
      });
      onOpenChange(false);
    } catch (error: any) {
      const firstError = error.errors?.[0];
      toast.error(firstError?.message || "Invalid form data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{teacher ? "Edit Teacher / استاد میں ترمیم" : "Add New Teacher / نیا استاد شامل کریں"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="qualification">Qualification / قابلیت *</Label>
            <Input
              id="qualification"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject / مضمون *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact / رابطہ *</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="specialization">Specialization / تخصص</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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