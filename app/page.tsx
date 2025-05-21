import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Home, Info } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="flex flex-col items-center justify-between space-y-8"
      //className="flex flex-col items-center justify-between p-8 md:p-24 bg-slate-50 dark:bg-slate-900"
    >
      {/* Hero Section */}
      <div className="w-full max-w-5xl text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white">
          Welcome to My Site
        </h1>
        <p className="text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
          A beautiful home page built with Next.js and shadcn/ui components.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/docs" passHref>
            <Button size="lg" asChild>
              <span>
                View API Documentation
                <ChevronRight className="ml-2 h-4 w-4 inline" />
              </span>
            </Button>
          </Link>

          <Link href="/api" passHref>
            <Button variant="outline" size="lg" asChild>
              <span>Go to Backend Home</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert Section */}
      <Alert className="max-w-2xl w-full bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          This page uses shadcn/ui components for a clean, accessible design
          system.
        </AlertDescription>
      </Alert>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl py-8">
        {[
          {
            title: "Responsive Design",
            description:
              "Fully responsive layout that works on all devices and screen sizes.",
            icon: <Home width={24} height={24} />,
          },
          {
            title: "shadcn/ui Components",
            description:
              "Beautiful, accessible components built on top of Radix UI and Tailwind CSS.",
            icon: <Info width={24} height={24} />,
          },
          {
            title: "Next.js Framework",
            description:
              "Built with Next.js for optimal performance and developer experience.",
            icon: <ChevronRight width={24} height={24} />,
          },
        ].map((feature, index) => (
          <Card key={index} className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 w-fit">
                {feature.icon}
              </div>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
