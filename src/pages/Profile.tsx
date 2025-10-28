import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Save, UserCog, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRoleChangeRequests } from '@/hooks/useRoleChangeRequests';
import { RoleChangeRequestDialog } from '@/components/Profile/RoleChangeRequestDialog';
import { Badge } from '@/components/ui/badge';
import { useUserRoles } from '@/hooks/useUserRoles';

export default function Profile() {
  const { t } = useTranslation();
  const { user, madrasaName, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [newMadrasaName, setNewMadrasaName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>('user');
  const [adminName, setAdminName] = useState<string>('');
  
  const { myRequests, isLoadingMyRequests, createRequest } = useRoleChangeRequests();
  const { userRoles } = useUserRoles();

  useEffect(() => {
    loadProfile();
    loadUserRole();
    loadAdminInfo();
  }, [user, userRoles]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, madrasa_name, logo_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || '');
        setNewMadrasaName(data.madrasa_name || '');
        setLogoUrl(data.logo_url || null);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserRole = () => {
    if (!user || !userRoles) return;
    const role = userRoles.find(r => r.user_id === user.id);
    if (role) {
      setCurrentRole(role.role);
    }
  };

  const loadAdminInfo = async () => {
    if (!user || !madrasaName) return;
    
    try {
      // Find admin in the same madrasa
      const { data: adminRoles, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profile:user_id (
            full_name,
            madrasa_name
          )
        `)
        .eq('role', 'admin');

      if (error) throw error;

      if (adminRoles && adminRoles.length > 0) {
        const admin = adminRoles.find(r => r.profile?.madrasa_name === madrasaName);
        if (admin && admin.profile) {
          setAdminName(admin.profile.full_name || 'Admin');
        }
      }
    } catch (error) {
      console.error('Error loading admin info:', error);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo size should be less than 2MB');
        return;
      }
      setLogoFile(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile || !madrasaName) return null;

    setUploading(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${madrasaName}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('madrasa-logos')
        .upload(fileName, logoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('madrasa-logos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      toast.error('Failed to upload logo: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let newLogoUrl = logoUrl;

      // Upload logo if a new file is selected
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          newLogoUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          madrasa_name: newMadrasaName,
          logo_url: newLogoUrl
        })
        .eq('id', user.id);

      if (error) throw error;

      setLogoUrl(newLogoUrl);
      setLogoFile(null);
      toast.success(t('profileUpdated'));
      
      // Reload the page to reflect changes
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeRequest = async (data: { requested_role: string; request_message?: string }) => {
    await createRequest.mutateAsync(data);
    setRoleDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700"><Clock className="h-3 w-3 mr-1" />{t('pending')}</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />{t('approved')}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-700"><XCircle className="h-3 w-3 mr-1" />{t('rejected')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('myAccount')}</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">{t('manageProfile')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Details */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t('accountDetails')}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{t('personalInformation')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('enterFullName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t('role')}</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="role"
                  type="text"
                  value={currentRole}
                  disabled
                  className="bg-muted flex-1"
                />
                {!isAdmin && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRoleDialogOpen(true)}
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    {t('requestChange')}
                  </Button>
                )}
              </div>
            </div>

            {adminName && (
              <div className="space-y-2">
                <Label>{t('adminName')}</Label>
                <Input
                  value={adminName}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Madrasa Details */}
        {isAdmin && (
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t('madrasaDetails')}</CardTitle>
              <CardDescription className="text-xs md:text-sm">{t('madrasaInformation')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="madrasaName">{t('madrasaName')}</Label>
                <Input
                  id="madrasaName"
                  type="text"
                  value={newMadrasaName}
                  onChange={(e) => setNewMadrasaName(e.target.value)}
                  placeholder={t('enterMadrasaName')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">{t('madrasaLogo')}</Label>
                <div className="flex items-center gap-3">
                  {(logoUrl || logoFile) && (
                    <div className="h-16 w-16 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center">
                      {logoFile ? (
                        <img
                          src={URL.createObjectURL(logoFile)}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Madrasa logo"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logoFile || logoUrl ? t('changeLogo') : t('uploadLogo')}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('logoSizeLimit')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Role Change Requests */}
      {!isAdmin && myRequests && myRequests.length > 0 && (
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{t('roleChangeRequests')}</CardTitle>
            <CardDescription className="text-xs md:text-sm">{t('trackRequests')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{request.requested_role}</span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                    {request.admin_response && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>{t('adminResponse')}:</strong> {request.admin_response}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={loading || uploading}
          className="gap-2"
        >
          {(loading || uploading) ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('saveChanges')}
            </>
          )}
        </Button>
      </div>

      <RoleChangeRequestDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSubmit={handleRoleChangeRequest}
        currentRole={currentRole}
      />
    </div>
  );
}
