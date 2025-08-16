import LoginForm from "@/components/Forms/LoginForm";
import BackButton from "@/components/Shared/BackButton";
import React from "react";

export default function Login() {
  return (
    <section className="min-h-screen flex justify-center items-center">
      <BackButton />

      <LoginForm />
    </section>
  );
}
