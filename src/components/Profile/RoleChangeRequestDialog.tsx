import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

const roleChangeSchema = z.object({
  requested_role: z.string().min(1, "Please select a role"),
  request_message: z.string().optional(),
});

type RoleChangeFormValues = z.infer<typeof roleChangeSchema>;

interface RoleChangeRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RoleChangeFormValues) => void;
  currentRole?: string;
}

export function RoleChangeRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  currentRole,
}: RoleChangeRequestDialogProps) {
  const { t } = useTranslation();
  const form = useForm<RoleChangeFormValues>({
    resolver: zodResolver(roleChangeSchema),
    defaultValues: {
      requested_role: "",
      request_message: "",
    },
  });

  const handleSubmit = (data: RoleChangeFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('requestRoleChange')}</DialogTitle>
          <DialogDescription>
            {t('currentRole')}: <strong>{currentRole || 'N/A'}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requested_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('requestedRole')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectRole')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">{t('admin')}</SelectItem>
                      <SelectItem value="teacher">{t('teacher')}</SelectItem>
                      <SelectItem value="manager">{t('manager')}</SelectItem>
                      <SelectItem value="student">{t('student')}</SelectItem>
                      <SelectItem value="parent">{t('parent')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="request_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('requestMessage')} ({t('optional')})</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('explainReason')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">{t('submitRequest')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}