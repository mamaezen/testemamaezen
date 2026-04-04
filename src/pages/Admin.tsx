import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, ArrowLeft, Key, LayoutDashboard, RefreshCw } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminSupport from '@/components/admin/AdminSupport';
import AdminLicenseKeys from '@/components/admin/AdminLicenseKeys';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))]">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
          <Badge variant="secondary" className="ml-auto">hemersondks@gmail.com</Badge>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4 bg-card/80 border border-border">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
              <LayoutDashboard className="w-3.5 h-3.5" /> Painel
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
              <Users className="w-3.5 h-3.5" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-1 text-xs">
              <MessageSquare className="w-3.5 h-3.5" /> Suporte
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-1 text-xs">
              <Key className="w-3.5 h-3.5" /> Chaves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="support" className="mt-4">
            <AdminSupport />
          </TabsContent>

          <TabsContent value="keys" className="mt-4">
            <AdminLicenseKeys />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
