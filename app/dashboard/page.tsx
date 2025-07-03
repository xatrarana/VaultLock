'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useVault } from '@/hooks/useVault';
import { VaultEntryFormData } from '@/types/vault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Plus, Trash2, User, Lock, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { entries, loading, error, fetchEntries, addEntry, deleteEntry, isReady } = useVault();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<VaultEntryFormData>({
    title: '',
    username: '',
    password: '',
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (isReady) {
      fetchEntries();
    }
  }, [isReady, fetchEntries]);

  const maskUserInfo = (info: string) => {
    if (!info || info.length <= 1) return info;
    return info[0] + '*'.repeat(Math.min(info.length - 1, 8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      await addEntry(formData);
      setFormData({ title: '', username: '', password: '', notes: '' });
      setIsFormOpen(false);
      toast.success('Entry added successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add entry');
    } finally {
      setFormLoading(false);
    }
  };

  const togglePasswordVisibility = (entryId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteEntry(id);
        toast.success('Entry deleted successfully');
      } catch (err) {
        toast.error('Failed to delete entry');
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Add Entry Form */}
        {isFormOpen && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Vault Entry</CardTitle>
              <CardDescription>
                Create a new password entry. Your password will be encrypted before storage.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Gmail Account"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="e.g., john@example.com"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Adding...' : 'Add Entry'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Vault Entries */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className='flex gap-x-2'>
                <h2 className="text-lg font-semibold text-gray-900">Your Vault Entries</h2>
            <Badge variant="secondary">{entries.length} entries</Badge>
            </span>
               <Button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Entry</span>
              </Button>
          </div>

          {loading && entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vault entries</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first password entry.</p>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription>
                          Created {new Date(entry.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id, entry.title)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Username */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Username:</span>
                        <span className="text-sm text-gray-700">{entry.username}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(entry.username, 'Username')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Password:</span>
                        <span className="text-sm text-gray-700 font-mono">
                          {visiblePasswords.has(entry.id)
                            ? entry.decryptedPassword
                            : '•'.repeat(12)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(entry.decryptedPassword, 'Password')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(entry.id)}
                        >
                          {visiblePasswords.has(entry.id) ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    {entry.notes && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-gray-600">Notes:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {entry.notes}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
