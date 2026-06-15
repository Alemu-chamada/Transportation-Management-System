import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { MainLayout } from "../routes/MainLayout";
import { MetricCard } from "../shared/ui/MetricCard";
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
  Calendar,
  CreditCard,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Map,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Loader2,
  Car,
  Plus,
  FileText,
  Settings,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { bookingApi } from "../features/booking/services";
import { userApi } from "../features/user/services";
import { tripApi } from "../features/trip/services";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalDrivers, setTotalDrivers] = useState("0");
  const [trips, setTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState("0");
  const [activeTrips, setActiveTrips] = useState("0");
  const [totalBookings, setTotalBookings] = useState("0");
  const [totalRevenue, setTotalRevenue] = useState("$0");

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_API_URL ?? "http://localhost:5002/api/v1";

    fetch(`${backendUrl}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success === true) {
          setBackendStatus("Online");
        } else {
          setBackendStatus(`Error: ${data?.message || "unknown"}`);
        }
      })
      .catch(() => {
        setBackendStatus("Offline");
      });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          // Load bookings
          try {
            const bookingsData = await bookingApi.getMyBookings();
            setMyBookings(bookingsData.bookings || []);
            setTotalBookings(bookingsData.bookings?.length.toString() || "0");
          } catch (error) {
            console.error("Failed to load bookings:", error);
          }

          // Load users data
          try {
            const userData = await userApi.getUsers();
            setUsers(userData.users || []);
            setTotalUsers(userData.users?.length.toString() || "0");
            setTotalDrivers(userData.users?.filter((u: any) => u.role === "driver").length.toString() || "0");
          } catch (error) {
            console.error("Failed to load users:", error);
          }

          // Load trips data
          try {
            const tripsData = await tripApi.getScheduledTrips();
            setTrips(tripsData.trips || []);
            setTotalTrips(tripsData.trips?.length.toString() || "0");
            setActiveTrips(tripsData.trips?.filter((t: any) => t.status === "IN_PROGRESS").length.toString() || "0");
            
            // Calculate revenue from bookings
            const revenue = bookingsData.bookings?.reduce((sum: number, booking: any) => {
              return sum + (booking.amount || 0);
            }, 0) || 0;
            setTotalRevenue(`$${revenue.toLocaleString()}`);
          } catch (error) {
            console.error("Failed to load trips:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Quick actions based on role
  const getQuickActions = () => {
    if (user?.role === "passenger") {
      return [
        { label: "Book a Trip", path: "/trips-discovery", icon: MapPin },
        { label: "My Bookings", path: "/my-bookings", icon: Calendar },
        { label: "Nearby Services", path: "/nearby", icon: Map },
      ];
    }
    if (user?.role === "driver") {
      return [
        { label: "Assigned Trips", path: "/admin", icon: Calendar },
        { label: "Start Trip", path: "/admin/trips", icon: Navigation },
      ];
    }
    // Admin
    return [
      { label: "Dashboard", path: "/admin", icon: Activity },
      { label: "User Management", path: "/admin/users", icon: Users },
      { label: "Trip Management", path: "/admin/trips", icon: Navigation },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: ShieldCheck },
    ];
  };

  const quickActions = getQuickActions();

  // Available features based on role
  const getFeatures = () => {
    if (user?.role === "passenger") {
      return [
        {
          title: "Browse Trips",
          description: "Discover available trips",
          icon: MapPin,
          path: "/trips-discovery",
        },
        {
          title: "My Bookings",
          description: "Manage your bookings",
          icon: Calendar,
          path: "/my-bookings",
        },
        {
          title: "Live Tracking",
          description: "Track your trips in real-time",
          icon: Navigation,
          path: "/tracking",
        },
        {
          title: "Nearby Services",
          description: "Find services around you",
          icon: Map,
          path: "/nearby",
        },
        {
          title: "Community",
          description: "Connect with others",
          icon: MessageSquare,
          path: "/community",
        },
      ];
    }
    if (user?.role === "driver") {
      return [
        {
          title: "Assigned Trips",
          description: "View your assigned trips",
          icon: Calendar,
          path: "/admin",
        },
      ];
    }
    // Admin
    return [
      {
        title: "Dashboard",
        description: "System overview",
        icon: Activity,
        path: "/admin",
      },
      {
        title: "User Management",
        description: "Manage users",
        icon: Users,
        path: "/admin/users",
      },
      {
        title: "Trip Management",
        description: "Manage all trips",
        icon: Navigation,
        path: "/admin/trips",
      },
      {
        title: "Booking Management",
        description: "Manage bookings",
        icon: Calendar,
        path: "/admin/bookings",
      },
      {
        title: "Audit Logs",
        description: "View system logs",
        icon: ShieldCheck,
        path: "/admin/audit-logs",
      },
      {
        title: "System Health",
        description: "Monitor system status",
        icon: TrendingUp,
        path: "/admin/system-health",
      },
    ];
  };

  const features = getFeatures();

  // Metrics available to all users
  const metrics = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      iconColor: "bg-blue-500",
      trend: { value: "Live data", isPositive: true },
    },
    {
      label: "Total Drivers",
      value: totalDrivers,
      icon: Car,
      iconColor: "bg-green-500",
      trend: { value: "Live data", isPositive: true },
    },
    {
      label: "Total Trips",
      value: totalTrips,
      icon: MapPin,
      iconColor: "bg-purple-500",
      trend: { value: "Live data", isPositive: true },
    },
    {
      label: "Active Trips",
      value: activeTrips,
      icon: TrendingUp,
      iconColor: "bg-orange-500",
      trend: { value: "Live data", isPositive: true },
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      iconColor: "bg-pink-500",
      trend: { value: "Live data", isPositive: true },
    },
    {
      label: "Revenue",
      value: totalRevenue,
      icon: DollarSign,
      iconColor: "bg-emerald-500",
      trend: { value: "Live data", isPositive: true },
    },
  ];

  // Admin-specific navigation links (only shown to system_admin)
  const adminLinks = [
    { label: "User Management", icon: Users, path: "/admin/users" },
    { label: "Trip Management", icon: MapPin, path: "/admin/trips" },
    { label: "Booking Management", icon: Calendar, path: "/admin/bookings" },
    { label: "Payment Management", icon: CreditCard, path: "/admin/payments" },
    { label: "Tracking Monitor", icon: TrendingUp, path: "/admin/tracking" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit-logs" },
    { label: "System Health", icon: Activity, path: "/admin/system-health" },
  ];

  // Admin-specific quick actions (only shown to system_admin)
  const adminQuickActions = [
    { label: "Create Trip", icon: Plus, path: "/admin/trips/create" },
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit-logs" },
    { label: "System Health", icon: Activity, path: "/admin/system-health" },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New user registration",
      user: "John Doe",
      time: "5 mins ago",
    },
    {
      id: 2,
      action: "Trip created",
      user: "Admin User",
      time: "15 mins ago",
    },
    {
      id: 3,
      action: "Booking confirmed",
      user: "Sarah Wilson",
      time: "30 mins ago",
    },
    {
      id: 4,
      action: "Payment received",
      user: "Mike Chen",
      time: "1 hour ago",
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your transportation system
              </p>
            </div>
            {user?.role === "system_admin" && (
              <Button onClick={() => navigate("/admin/settings")}>
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            )}
          </div>
          <Card className="p-8 bg-muted">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Welcome back, {user?.full_name}!
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                  </span>
                </div>
                <p className="text-muted-foreground text-lg">
                  What would you like to do today?
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Admin Navigation - Only for system_admin */}
        {user?.role === "system_admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Admin Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.label}
                      onClick={() => navigate(link.path)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Metrics - Available to all users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} delay={index * 0.1} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Revenue Overview
                </h2>
                <div className="h-64 bg-gradient-to-br from-muted/50 to-background rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Chart visualization placeholder
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Revenue trend for the last 6 months
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Booking Trends
                </h2>
                <div className="h-64 bg-gradient-to-br from-muted/50 to-background rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Chart visualization placeholder
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Booking volume over time
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Admin Quick Actions - Only for system_admin */}
            {user?.role === "system_admin" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {adminQuickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => navigate(action.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-foreground">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Backend health status
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {backendStatus}
                </p>
              </div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  backendStatus === "Online"
                    ? "bg-emerald-500 text-white"
                    : backendStatus === "Offline"
                    ? "bg-rose-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {backendStatus === "Online" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : backendStatus === "Offline" ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Available Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Available Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                className="transition-transform"
              >
                <Card className="p-5" hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(feature.path)}
                    >
                      Open
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
