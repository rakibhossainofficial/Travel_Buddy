import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-center text-primary">
        About the Developer
      </h1>

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-base leading-relaxed">
            I'm <strong>Rakib Hossain</strong>, a passionate full-stack
            developer focused on building scalable web applications with clean
            design and smooth user experiences. My goal is to help travelers
            explore Bangladesh with confidence using this platform.
          </p>
          <p className="text-muted-foreground">
            This website was created as part of a tourism management system
            project, bringing together packages, travel guides, and cultural
            experiences all in one place.
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">🔧 Skills Used</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>React + TanStack Query + Framer Motion</li>
              <li>Node.js + Express + MongoDB</li>
              <li>JWT authentication + Role-based Access Control</li>
              <li>shadcn/ui + Tailwind CSS for consistent UI components</li>
              <li>Stripe integration for secure tour payments</li>
            </ul>
          </div>

          <Button className="mt-4" asChild>
            <a href="https://github.com/adnan-dev" target="_blank">
              Visit My GitHub
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
