import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MainLayout } from "../../routes/MainLayout";
import { MetricCard } from "../../shared/ui/MetricCard";
import { Card } from "../../shared/ui/Card";
import { Button } from "../../shared/ui/Button";
import {
  Users,
  Car,
  MapPin,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Settings,
  FileText,
  Activity,
  ShieldCheck,
  CreditCard,
  Bell,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { userApi } from "../../features/user/services";
import { tripApi } from "../../features/trip/services";
import { bookingApi } from "../../features/booking/services";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalDrivers, setTotalDrivers] = useState("0");
  const [trips, setTrips] = useState([]);
  const [totalTrips, setTotalTrips] = useState("0");
  const [activeTrips, setActiveTrips] = useState("0");
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState("0");
  const [totalRevenue, setTotalRevenue] = useState("$0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userData = await userApi.getUsers();
        setUsers(userData.users);
        setTotalUsers(userData.users.length.toString());
        setTotalDrivers(userData.users.filter((u: any) => u.role === "driver").length.toString());

        // Fetch trips
        const tripsData = await tripApi.getScheduledTrips();
        setTrips(tripsData.trips);
        setTotalTrips(tripsData.trips.length.toString());
        setActiveTrips(tripsData.trips.filter((t: any) => t.status === "IN_PROGRESS" || t.status === "active").length.toString());

        // Fetch bookings
        const bookingsData = await bookingApi.getMyBookings();
        setBookings(bookingsData.bookings);
        setTotalBookings(bookingsData.bookings.length.toString());

        // Calculate revenue
        const revenue = bookingsData.bookings.reduce((sum: number, booking: any) => {
          return sum + (booking.amount || 0);
        }, 0);
        setTotalRevenue(`$${revenue.toLocaleString()}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  const adminLinks = [
    { label: "User Management", icon: Users, path: "/admin/users" },
    { label: "Trip Management", icon: MapPin, path: "/admin/trips" },
    { label: "Booking Management", icon: Calendar, path: "/admin/bookings" },
    { label: "Payment Management", icon: CreditCard, path: "/admin/payments" },
    { label: "Tracking Monitor", icon: TrendingUp, path: "/admin/tracking" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit-logs" },
    { label: "System Health", icon: Activity, path: "/admin/system-health" },
  ];

  const quickActions = [
    { label: "Create Trip", icon: Plus, path: "/admin/trips/create" },
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit-logs" },
    { label: "System Health", icon: Activity, path: "/admin/system-health" },
  ];

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString([], { month: "short", day: "numeric" });

  const recentTrips = (trips as any[]).slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your transportation system
              </p>
            </div>
            <Button onClick={() => navigate("/admin/settings")}>
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Admin Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted hover:border-primary/20 border border-transparent transition-all text-left group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

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
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">{totalRevenue}</p>
                    <p className="text-xs text-muted-foreground mt-1">From bookings</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Bookings</p>
                    <p className="text-3xl font-bold text-foreground">{totalBookings}</p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Active Trips</p>
                    <p className="text-3xl font-bold text-foreground">{activeTrips}</p>
                    <p className="text-xs text-muted-foreground mt-1">Currently running</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">System Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Users</p>
                    <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Registered users</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Drivers</p>
                    <p className="text-3xl font-bold text-foreground">{totalDrivers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active drivers</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Trips</p>
                    <p className="text-3xl font-bold text-foreground">{totalTrips}</p>
                    <p className="text-xs text-muted-foreground mt-1">Scheduled trips</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => navigate(action.path)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted hover:border-primary/20 border border-transparent transition-all text-left group"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-foreground text-sm">{action.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Trips</h3>
                  <button
                    onClick={() => navigate("/admin/trips")}
                    className="text-xs text-primary hover:underline"
                  >
                    View all
                  </button>
                </div>
                {recentTrips.length === 0 ? (
                  <div className="text-center py-6">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No trips yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTrips.map((trip: any) => (
                      <div
                        key={trip.id}
                        className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                      >
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {trip.origin} → {trip.destination}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {formatDate(trip.scheduled_start_time)} · {formatTime(trip.scheduled_start_time)}
                            </p>
                          </div>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize
                            ${trip.status === "active" || trip.status === "IN_PROGRESS"
                              ? "bg-green-100 text-green-700"
                              : trip.status === "scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"}`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
