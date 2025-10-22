import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@/hooks/useClasses";
import { useTeachers } from "@/hooks/useTeachers";
import { classSchema } from "@/lib/validations";
import { toast } from "sonner";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classData: Omit<Class, "id" | "created_at" | "updated_at">) => void;
  classData?: Class;
}

export function ClassDialog({ open, onOpenChange, onSave, classData }: ClassDialogProps) {
  const { teachers } = useTeachers();
  const [formData, setFormData] = useState({
    name: "",
    teacher_id: "",
    schedule: "",
    duration: "",
    room: "",
    level: "",
    students_count: 0,
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        teacher_id: classData.teacher_id || "",
        schedule: classData.schedule || "",
        duration: classData.duration || "",
        room: classData.room || "",
        level: classData.level || "",
        students_count: classData.students_count,
      });
    } else {
      setFormData({
        name: "",
        teacher_id: "",
        schedule: "",
        duration: "",
        room: "",
        level: "",
        students_count: 0,
      });
    }
  }, [classData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      const validatedData = classSchema.parse({
        name: formData.name,
        teacher_id: formData.teacher_id || null,
        schedule: formData.schedule || '',
        duration: formData.duration || '',
        room: formData.room || '',
        level: formData.level || '',
        students_count: formData.students_count,
      });
      
      onSave({
        name: validatedData.name,
        teacher_id: validatedData.teacher_id || undefined,
        schedule: validatedData.schedule || undefined,
        duration: validatedData.duration || undefined,
        room: validatedData.room || undefined,
        level: validatedData.level || undefined,
        students_count: validatedData.students_count,
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
          <DialogTitle>{classData ? "Edit Class" : "Add New Class"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Select value={formData.teacher_id} onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
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
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 1 hour"
            />
          </div>
          <div>
            <Label htmlFor="room">Room</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
