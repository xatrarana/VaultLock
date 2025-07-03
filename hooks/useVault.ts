import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { CryptoWrapper } from '@/lib/crypto';
import {
  VaultEntry,
  DecryptedVaultEntry,
  CreateVaultEntryRequest,
  VaultEntryFormData
} from '@/types/vault';

export function useVault() {
  const { user } = useUser();
  const [entries, setEntries] = useState<DecryptedVaultEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = !!user?.id;

  // Fetch vault entries
  const fetchEntries = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vault');
      if (!response.ok) throw new Error('Failed to fetch entries');

      const vaultEntries: VaultEntry[] = await response.json();

      // Decrypt passwords client-side using user.id as password
      const decryptedEntries: DecryptedVaultEntry[] = await Promise.all(
        vaultEntries.map(async (entry) => {
          try {
            const decryptedPassword = await CryptoWrapper.decrypt(
              entry.encryptedPassword,
              user.id
            );
            return {
              ...entry,
              decryptedPassword,
            };
          } catch (err) {
            console.error('Failed to decrypt entry:', entry.id, err);
            return {
              ...entry,
              decryptedPassword: '[Decryption Failed]',
            };
          }
        })
      );

      setEntries(decryptedEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Add new vault entry
  const addEntry = async (formData: VaultEntryFormData) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      // Encrypt password using user.id as password
      const encryptedPassword = await CryptoWrapper.encrypt(
        formData.password,
        user.id
      );

      const requestData: CreateVaultEntryRequest = {
        title: formData.title,
        username: formData.username,
        encryptedPassword,
        notes: formData.notes,
      };

      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Failed to create entry');

      const newEntry: VaultEntry = await response.json();

      const decryptedEntry: DecryptedVaultEntry = {
        ...newEntry,
        decryptedPassword: formData.password,
      };

      setEntries((prev) => [...prev, decryptedEntry]);
      return decryptedEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete vault entry
  const deleteEntry = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entry');

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    loading,
    error,
    fetchEntries,
    addEntry,
    deleteEntry,
    isReady,
  };
}
