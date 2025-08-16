import RegisterForm from "@/components/Forms/RegisterForm";
import BackButton from "@/components/Shared/BackButton";
import React from "react";

export default function Register() {
  return (
    <section className="min-h-screen flex justify-center items-center">
      <BackButton />

      <RegisterForm />
    </section>
  );
}
