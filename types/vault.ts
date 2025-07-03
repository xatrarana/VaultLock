export interface VaultEntry {
  id: string;
  userId: string;
  title: string;
  username: string;
  encryptedPassword: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVaultEntryRequest {
  title: string;
  username: string;
  encryptedPassword: string;
  notes?: string;
}

export interface VaultEntryFormData {
  title: string;
  username: string;
  password: string;
  notes?: string;
}

export interface DecryptedVaultEntry extends Omit<VaultEntry, 'encryptedPassword'> {
  decryptedPassword: string;
}