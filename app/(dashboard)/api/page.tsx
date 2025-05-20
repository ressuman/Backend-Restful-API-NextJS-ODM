import { ArrowRight, BookOpen, Code2, Server } from "lucide-react";
import Link from "next/link";

export default function ApiHome() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Modern API Documentation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            A powerful REST API built with Next.js and documented with Swagger
            UI, providing a seamless development experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Server className="w-12 h-12 text-blue-600 dark:text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-500">
              RESTful API
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Built with Next.js API routes, providing a robust and scalable
              backend infrastructure.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-500">
              Swagger Documentation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Interactive API documentation powered by Swagger UI, making it
              easy to explore and test endpoints.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Code2 className="w-12 h-12 text-blue-600 dark:text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-500">
              Type Safety
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Built with TypeScript for enhanced developer experience and code
              reliability.
            </p>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/docs"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View API Documentation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
