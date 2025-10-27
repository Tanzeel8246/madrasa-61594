import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePendingUserRoles } from '@/hooks/usePendingUserRoles';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const JoinRequestForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'user'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPendingRole } = usePendingUserRoles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !fullName || !mobile) {
      toast.error(t('fillAllFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      await createPendingRole.mutateAsync({
        email,
        role: selectedRole,
        full_name: fullName,
        mobile
      });

      toast.success(t('joinRequestSuccess'));
      
      // Reset form
      setEmail('');
      setFullName('');
      setMobile('');
      setSelectedRole('user');
    } catch (error: any) {
      toast.error(error.message || t('joinRequestError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="join-fullName">{t('fullName')}</Label>
        <Input
          id="join-fullName"
          type="text"
          placeholder={t('enterFullName')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="join-email">{t('email')}</Label>
        <Input
          id="join-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="join-mobile">{t('mobileNumber')}</Label>
        <Input
          id="join-mobile"
          type="tel"
          placeholder={t('enterMobile')}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-select">{t('selectRole')}</Label>
        <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as 'teacher' | 'user')} required>
          <SelectTrigger id="role-select">
            <SelectValue placeholder={t('selectRole')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teacher">{t('teacher')}</SelectItem>
            <SelectItem value="user">{t('user')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
        ) : (
          t('sendRequest')
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t('joinRequestNote')}
      </p>
    </form>
  );
};

export default JoinRequestForm;
