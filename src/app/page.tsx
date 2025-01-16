"use client";

import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Braces,
  Code,
  GitCommit,
  Presentation,
  Rocket,
  Star,
} from "lucide-react";
import { redirect } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { isSignedIn } = useUser();
  if (isSignedIn) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <div className="flex items-center gap-6">
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="bg-grid-black/[0.02] absolute inset-0 -z-10" />
        <div className="container relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-6 bg-pink-500" variant="outline">
              Now in Public Beta
            </Badge>
            <h1 className="mb-8 max-w-4xl bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-6xl font-bold tracking-tight text-transparent lg:text-7xl">
              Transform Your GitHub Workflow with AI-Powered Insights
            </h1>
            <p className="mb-10 max-w-2xl text-xl text-muted-foreground">
              Repo Recap revolutionizes how developers understand and interact
              with their repositories, providing intelligent analysis and
              actionable insights.
            </p>
          </motion.div>
          <motion.div
            className="mb-20 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 gap-8 rounded-lg border bg-secondary/50 p-10 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="mb-3 text-5xl font-bold text-primary">91%</div>
              <div className="text-muted-foreground">
                Developer Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="mb-3 text-5xl font-bold text-primary">5k+</div>
              <div className="text-muted-foreground">
                Lines of Code Processed
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-secondary/30 py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-6 text-4xl font-bold">
              Powerful Features for Modern Development
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Everything you need to understand and manage your repositories
              more effectively
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Code className="h-8 w-8" />,
                title: "Code Intelligence",
                description:
                  "Advanced code analysis and insights powered by cutting-edge AI models",
              },
              {
                icon: <Presentation className="h-8 w-8" />,
                title: "Meeting Analytics",
                description:
                  "Get insights from your meetings and improve your team's productivity",
              },
              {
                icon: <GitCommit className="h-8 w-8" />,
                title: "Commit Insights",
                description: "Detailed analysis of previous commits",
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Quality Metrics",
                description:
                  "Track code quality metrics and get actionable improvement suggestions",
              },
              {
                icon: <Braces className="h-8 w-8" />,
                title: "Code Search",
                description:
                  "Natural language code search across all your repositories",
              },
              {
                icon: <Rocket className="h-8 w-8" />,
                title: "Performance Tracking",
                description:
                  "Monitor and optimize your development workflow efficiency",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-6 text-primary">{feature.icon}</div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 -z-10 bg-primary/10" />
        <div className="container relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-16 text-center">
              <h2 className="mb-6 text-5xl font-bold">
                Ready to Supercharge Your GitHub Workflow?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
                Join thousands of developers who are already using Repo Recap to
                build better software, faster.
              </p>
              <div className="flex justify-center gap-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2">
                    Get Started Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-semibold">Repo Recap</span>
            </div>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Repo Recap. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
