"use client";

import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Docs() {
  return (
    <>
      {" "}
      {/* <div>
        <h1 className="text-3xl font-bold mb-4 text-center">API Doc</h1>
        <SwaggerUI url="/swagger/swagger.json" />
      </div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          API Documentation
        </h2>
        <SwaggerUI url="/swagger/swagger.json" />
      </div> */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Head>
          <title>API Documentation | Notes API</title>
          <meta
            name="description"
            content="API documentation for the Notes application"
          />
        </Head>

        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-3xl font-bold leading-tight text-gray-900">
                    API Documentation
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Explore and test the Notes API endpoints
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <nav className="-mb-px flex space-x-8">
                  <a
                    href="#"
                    className="border-indigo-500 text-indigo-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                  >
                    REST API
                  </a>
                  <a
                    href="#"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                  >
                    Getting Started
                  </a>
                  <a
                    href="#"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                  >
                    Authentication
                  </a>
                  <a
                    href="#"
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                  >
                    Examples
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Environment selector */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Interactive API Reference
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Environment:</span>
                  <select
                    className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    defaultValue="production"
                  >
                    <option value="local">Local Development</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Swagger UI Container with custom styling */}
            <div className="swagger-ui-container">
              <SwaggerUI url="/swagger/swagger.json" />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </div>
              <div className="text-sm text-gray-500">
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms
                </a>
                <span className="mx-2">•</span>
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Custom CSS to better integrate Swagger UI with Tailwind */}
        <style jsx global>{`
          /* Improve Swagger UI integration with Tailwind */
          .swagger-ui .opblock-tag {
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            font-family: ui-sans-serif, system-ui, -apple-system,
              BlinkMacSystemFont, "Segoe UI", Roboto !important;
          }

          .swagger-ui .opblock .opblock-summary-operation-id,
          .swagger-ui .opblock .opblock-summary-path,
          .swagger-ui .opblock .opblock-summary-path__deprecated {
            font-family: ui-sans-serif, system-ui, -apple-system,
              BlinkMacSystemFont, "Segoe UI", Roboto !important;
          }

          .swagger-ui .btn {
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
              0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
          }

          .swagger-ui select {
            padding: 0.375rem 1.75rem 0.375rem 0.75rem !important;
          }

          .swagger-ui-container {
            padding: 1rem;
          }
        `}</style>
      </div>
    </>
  );
}
