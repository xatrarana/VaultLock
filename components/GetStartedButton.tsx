'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function GetStaredButton() {
    const router = useRouter();
    return (
        <Button 
            aria-label="Get Started"
            onClick={() => router.push('/dashboard')}
            className="text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">Get Started</Button>
    )
}