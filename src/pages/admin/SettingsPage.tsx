import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    username: user?.username || 'arnold',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (settings.newPassword && !settings.currentPassword) {
      toast.error('Please enter current password');
      return;
    }
    toast.success('Settings saved successfully!');
    setSettings({ ...settings, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Update login credentials</p>
        </div>
      </div>

      {/* Login Settings */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Login Credentials</CardTitle>
              <p className="text-xs text-muted-foreground">Update username & password</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Username</label>
            <Input
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-4">Change Password</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                <Input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <Input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
