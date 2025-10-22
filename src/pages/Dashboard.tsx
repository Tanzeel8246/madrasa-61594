import { Users, GraduationCap, BookOpen, ClipboardCheck } from "lucide-react";
import StatsCard from "@/components/Dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Mock data
  const stats = [
    {
      title: "Total Students",
      value: "342",
      icon: Users,
      trend: { value: "+12 this month", isPositive: true },
    },
    {
      title: "Total Teachers",
      value: "28",
      icon: GraduationCap,
      trend: { value: "+2 this month", isPositive: true },
    },
    {
      title: "Active Classes",
      value: "16",
      icon: BookOpen,
      trend: { value: "4 starting soon", isPositive: true },
    },
    {
      title: "Attendance Rate",
      value: "94%",
      icon: ClipboardCheck,
      trend: { value: "+2% from last week", isPositive: true },
    },
  ];

  const recentActivities = [
    { id: 1, title: "New student registered", time: "2 hours ago", type: "student" },
    { id: 2, title: "Quran class completed", time: "4 hours ago", type: "class" },
    { id: 3, title: "Attendance marked for Class 5A", time: "6 hours ago", type: "attendance" },
    { id: 4, title: "New teacher assigned", time: "1 day ago", type: "teacher" },
  ];

  const upcomingClasses = [
    { id: 1, name: "Quran Recitation", time: "9:00 AM", teacher: "Ustadh Ahmed", students: 24 },
    { id: 2, name: "Arabic Grammar", time: "11:00 AM", teacher: "Ustadha Fatima", students: 18 },
    { id: 3, name: "Islamic History", time: "2:00 PM", teacher: "Ustadh Ibrahim", students: 22 },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Here's what's happening in your madrasa today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Today's schedule overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{classItem.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {classItem.teacher} • {classItem.students} students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{classItem.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline">
              View All Classes
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <Users className="h-6 w-6" />
              <span>Add Student</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <GraduationCap className="h-6 w-6" />
              <span>Add Teacher</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <BookOpen className="h-6 w-6" />
              <span>Create Class</span>
            </Button>
            <Button className="h-auto flex-col gap-2 py-4" variant="outline">
              <ClipboardCheck className="h-6 w-6" />
              <span>Mark Attendance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
