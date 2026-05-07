import { SignUp } from "@clerk/react";

export default function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        routing="path"
        path="/register"
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
}