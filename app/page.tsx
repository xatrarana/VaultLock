import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock, ShieldCheck, Fingerprint } from 'lucide-react';
import GetStaredButton from '@/components/GetStartedButton';
import { LandingHeader } from '@/components/landing/Header';

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
    <LandingHeader/>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gray-50 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 max-w-xl mb-4">
          Securely Store and Manage Your Passwords with <span className="text-blue-600">VaultLock</span>
        </h2>
        <p className="text-gray-600 max-w-lg mb-6">
          VaultLock is a privacy-first, modern password manager that encrypts your data locally using Web Crypto and gives you full control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <GetStaredButton/>
          <Link href="#features">
            <Button  className='cursor-pointer' variant="outline">Learn More</Button>
          </Link>
        </div>
      </main>

      <section id="features" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-600">Passwords are encrypted client-side using AES-GCM with keys derived from your identity.</p>
          </div>
          <div className="flex flex-col items-center">
            <Fingerprint className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">2FA Login</h3>
            <p className="text-gray-600">Secure access using Google Sign-In and Two-Factor Authentication powered by Clerk.</p>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Private by Design</h3>
            <p className="text-gray-600">No server-side decryption. Only you can read your secrets—vaulted in your browser.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
        Built with ❤️ by Chhatra Rana &middot; VaultLock &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
