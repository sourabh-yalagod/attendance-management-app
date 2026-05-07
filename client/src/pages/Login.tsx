import { SignIn } from "@clerk/react";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </div>
  );
}