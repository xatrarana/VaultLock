import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className="flex items-center justify-center h-screen">
    <SignIn appearance={{
      elements: {
        formButtonPrimary: "text-white! bg-blue-600! shadow-[0_4px_12px_0_#2563eb33]! hover:bg-blue-700 cursor-pointer",
        footerActionLink: "text-blue-600!"
      }
    }
    }/>
  </div>
  )

}