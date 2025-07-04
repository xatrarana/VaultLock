'use client';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import Link from 'next/link';


export default function UserActionButton() {
    const { user } = useUser();

    return (
        <>
            {!user && (
                <>
                    <SignInButton>
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button className="text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">Sign Up</Button>
                    </SignUpButton>
                </>
            )}
            {user && (
                <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                </Link>
            )}
        </>
    )
}