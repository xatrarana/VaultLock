import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
    return (
            <main className="flex items-center justify-center">
                <UserProfile />
            </main>

    )
}

