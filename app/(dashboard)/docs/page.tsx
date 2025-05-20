"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Docs() {
  const { theme } = useTheme();

  // Function to inject custom CSS based on theme
  useEffect(() => {
    const updateSwaggerTheme = () => {
      // Remove any previously injected style
      const existingStyle = document.getElementById("swagger-theme-styles");
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create and inject new style based on current theme
      const styleElement = document.createElement("style");
      styleElement.id = "swagger-theme-styles";

      if (theme === "dark") {
        styleElement.textContent = `
          /* Dark theme styles for Swagger UI */
          .swagger-ui {
            color: #e2e8f0;
            background-color: transparent;
          }

          .swagger-ui .info .title,
          .swagger-ui .opblock-tag,
          .swagger-ui .opblock .opblock-summary-operation-id,
          .swagger-ui .opblock .opblock-summary-path,
          .swagger-ui .opblock .opblock-summary-path__deprecated,
          .swagger-ui .opblock .opblock-summary-description,
          .swagger-ui .model-title,
          .swagger-ui label,
          .swagger-ui .parameter__name,
          .swagger-ui table thead tr th {
            color: #e2e8f0 !important;
          }

          .swagger-ui .opblock {
            background-color: #1e293b !important;
            border-color: #334155 !important;
          }

          .swagger-ui .opblock .opblock-summary {
            border-color: #334155 !important;
          }

          .swagger-ui .opblock-tag {
            border-bottom-color: #334155 !important;
          }

          .swagger-ui input,
          .swagger-ui select,
          .swagger-ui textarea {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border-color: #475569 !important;
          }

          .swagger-ui section.models {
            background-color: #1e293b !important;
            border-color: #334155 !important;
          }

          .swagger-ui section.models.is-open h4 {
            background-color: #334155 !important;
            border-color: #475569 !important;
          }

          .swagger-ui .scheme-container {
            background-color: #0f172a !important;
            box-shadow: none !important;
            border-color: #334155 !important;
          }

          .swagger-ui table {
            background-color: #1e293b !important;
            border-color: #334155 !important;
          }

          .swagger-ui .response-col_status {
            color: #e2e8f0 !important;
          }

          .swagger-ui .responses-wrapper,
          .swagger-ui .parameters-container,
          .swagger-ui .model-box,
          .swagger-ui .model {
            background-color: #1e293b !important;
          }

          .swagger-ui .model-box {
            background-color: #334155 !important;
          }

          .swagger-ui .topbar {
            background-color: #1e293b !important;
          }

          .swagger-ui .btn {
            background-color: #334155 !important;
            color: #e2e8f0 !important;
            border-color: #475569 !important;
          }

          .swagger-ui .microlight {
            background-color: #0f172a !important;
            color: #e2e8f0 !important;
          }
        `;
      }

      document.head.appendChild(styleElement);
    };

    updateSwaggerTheme();
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
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
                <h2 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
                  API Documentation
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Explore and test the Notes API endpoints
                </p>
              </div>
            </div>

            <div className="mt-4">
              <nav className="-mb-px flex space-x-8">
                <a
                  href="#"
                  className="border-indigo-500 text-indigo-600 dark:text-indigo-400 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                >
                  REST API
                </a>
                <a
                  href="#"
                  className="border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                >
                  Getting Started
                </a>
                <a
                  href="#"
                  className="border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                >
                  Authentication
                </a>
                <a
                  href="#"
                  className="border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Environment selector */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Interactive API Reference
              </h3>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="environment-select"
                  className="text-sm text-slate-500 dark:text-slate-400"
                >
                  Environment:
                </label>
                <select
                  id="environment-select"
                  className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm text-slate-900 dark:text-white"
                  defaultValue="production"
                  aria-label="Environment"
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
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Your Company. All rights
              reserved.
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <a
                href="#hg"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Terms
              </a>
              <span className="mx-2">•</span>
              <a
                href="#sd"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Base Tailwind styles for Swagger UI integration */}
      <style jsx global>{`
        /* Base Swagger UI styles (common to light/dark) */
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
  );
}
