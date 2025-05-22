import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Settings, User } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-36 bg-slate-50 dark:bg-slate-950">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">Dashboard</CardTitle>
          <CardDescription>Welcome to your personal dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-blue-500" />
                  <CardTitle className="text-lg">Account Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  View and manage your account details.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Activity size={20} className="text-green-500" />
                  <CardTitle className="text-lg">Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Check your recent activity and notifications.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Activity
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Settings size={20} className="text-purple-500" />
                  <CardTitle className="text-lg">Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Customize your preferences and settings.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
