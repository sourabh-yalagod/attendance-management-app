import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export default function NavBar() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">My App</h1>
      <div className="flex gap-3 items-center">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  )
}