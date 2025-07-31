import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  Database,
  Shield,
  Zap,
  Users,
  MessageSquare,
  Play,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Modern Fake API
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nikode: The Ultimate Anime & Game Character API
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Instantly access detailed, structured data on your favorite anime
            and video game characters. Ideal for rapid prototyping, educational
            projects, and building next-gen applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/docs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Nikode API?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with modern technologies and best practices for the best
            developer experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Rich Data</CardTitle>
              <CardDescription>
                15+ popular anime characters with detailed information including
                powers, abilities, and personality traits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>API Key Authentication</CardTitle>
              <CardDescription>
                Secure API key-based authentication with role-based access
                control for different permission levels.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Modern Tech Stack</CardTitle>
              <CardDescription>
                Built with Next.js 15, TypeScript, Zod validation, and
                comprehensive error handling.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Complete user system with roles, profiles, and relationship
                management between users and characters.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Comments & Ratings</CardTitle>
              <CardDescription>
                Interactive comment system with ratings, allowing users to share
                their thoughts on characters.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Ready to Use</CardTitle>
              <CardDescription>
                Fully functional API with comprehensive documentation, examples,
                and test coverage.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground">
              Get started with Nikode API in minutes. Here&apos;s a simple
              example:
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Get All Characters</CardTitle>
              <CardDescription>
                Retrieve a list of all anime characters with pagination and
                filtering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600">GET</span>
                  <span className="text-muted-foreground">/api/characters</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-blue-600">Headers:</span>
                    <div className="ml-4 text-xs">
                      X-API-Key: demo-api-key-123
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600">Query Parameters:</span>
                    <div className="ml-4 text-xs">
                      page=1&limit=10&sortBy=power&sortOrder=desc
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Built with ❤️ using Next.js, TypeScript, and modern web
              technologies
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                href="/docs/api"
                className="text-muted-foreground hover:text-foreground"
              >
                API Reference
              </Link>
              <Link
                href="/docs/testing"
                className="text-muted-foreground hover:text-foreground"
              >
                Testing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
