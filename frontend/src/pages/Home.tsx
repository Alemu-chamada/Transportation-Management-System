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
  const [trips, setTrips] = useState<any[]>([]);
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
        setBackendStatus(data?.success === true ? "Online" : `Error: ${data?.message || "unknown"}`);
      })
      .catch(() => setBackendStatus("Offline"));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          let bookingsData: any = { bookings: [] };
          try {
            bookingsData = await bookingApi.getMyBookings();
            setMyBookings(bookingsData.bookings || []);
            setTotalBookings((bookingsData.bookings?.length ?? 0).toString());
          } catch (e) { console.error("Failed to load bookings:", e); }

          try {
            const userData = await userApi.getUsers();
            setUsers(userData.users || []);
            setTotalUsers((userData.users?.length ?? 0).toString());
            setTotalDrivers((userData.users?.filter((u: any) => u.role === "driver").length ?? 0).toString());
          } catch (e) { console.error("Failed to load users:", e); }

          try {
            const tripsData = await tripApi.getScheduledTrips();
            setTrips(tripsData.trips || []);
            setTotalTrips((tripsData.trips?.length ?? 0).toString());
            setActiveTrips((tripsData.trips?.filter((t: any) => t.status === "IN_PROGRESS" || t.status === "active").length ?? 0).toString());
            const revenue = bookingsData.bookings?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;
            setTotalRevenue(`$${revenue.toLocaleString()}`);
          } catch (e) { console.error("Failed to load trips:", e); }
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

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
    return [
      { label: "Dashboard", path: "/admin", icon: Activity },
      { label: "User Management", path: "/admin/users", icon: Users },
      { label: "Trip Management", path: "/admin/trips", icon: Navigation },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: ShieldCheck },
    ];
  };
  const quickActions = getQuickActions();

  const getFeatures = () => {
    if (user?.role === "passenger") {
      return [
        { title: "Browse Trips", description: "Discover available trips", icon: MapPin, path: "/trips-discovery" },
        { title: "My Bookings", description: "Manage your bookings", icon: Calendar, path: "/my-bookings" },
        { title: "Live Tracking", description: "Track your trips in real-time", icon: Navigation, path: "/tracking" },
        { title: "Nearby Services", description: "Find services around you", icon: Map, path: "/nearby" },
        { title: "Community", description: "Connect with others", icon: MessageSquare, path: "/community" },
      ];
    }
    if (user?.role === "driver") {
      return [{ title: "Assigned Trips", description: "View your assigned trips", icon: Calendar, path: "/admin" }];
    }
    return [
      { title: "Dashboard", description: "System overview", icon: Activity, path: "/admin" },
      { title: "User Management", description: "Manage users", icon: Users, path: "/admin/users" },
      { title: "Trip Management", description: "Manage all trips", icon: Navigation, path: "/admin/trips" },
      { title: "Booking Management", description: "Manage bookings", icon: Calendar, path: "/admin/bookings" },
      { title: "Audit Logs", description: "View system logs", icon: ShieldCheck, path: "/admin/audit-logs" },
      { title: "System Health", description: "Monitor system status", icon: TrendingUp, path: "/admin/system-health" },
    ];
  };
  const features = getFeatures();

  const metrics = [
    { label: "Total Users", value: totalUsers, icon: Users, iconColor: "bg-blue-500", trend: { value: "Live data", isPositive: true } },
    { label: "Total Drivers", value: totalDrivers, icon: Car, iconColor: "bg-green-500", trend: { value: "Live data", isPositive: true } },
    { label: "Total Trips", value: totalTrips, icon: MapPin, iconColor: "bg-purple-500", trend: { value: "Live data", isPositive: true } },
    { label: "Active Trips", value: activeTrips, icon: TrendingUp, iconColor: "bg-orange-500", trend: { value: "Live data", isPositive: true } },
    { label: "Total Bookings", value: totalBookings, icon: Calendar, iconColor: "bg-pink-500", trend: { value: "Live data", isPositive: true } },
    { label: "Revenue", value: totalRevenue, icon: DollarSign, iconColor: "bg-emerald-500", trend: { value: "Live data", isPositive: true } },
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

  const adminQuickActions = [
    { label: "Create Trip", icon: Plus, path: "/admin/trips/create" },
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit-logs" },
    { label: "System Health", icon: Activity, path: "/admin/system-health" },
  ];

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString([], { month: "short", day: "numeric" });

  const isNonAdmin = user?.role !== "system_admin";
  const isPassenger = user?.role === "passenger";

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
              <h1 className="text-4xl font-bold text-foreground mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your transportation system</p>
            </div>
            {user?.role === "system_admin" && (
              <Button onClick={() => navigate("/admin/settings")}>
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            )}
          </div>
          <Card className="p-8 overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #030213 0%, #1a1740 60%, #0f0c2e 100%)" }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Welcome back</p>
                <h2 className="text-3xl font-bold text-white mb-1">{user?.full_name}</h2>
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white/90 text-sm font-medium capitalize">
                  {user?.role?.replace(/_/g, " ")}
                </span>
                <p className="text-white/60 mt-3 text-sm">What would you like to do today?</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-all border border-white/20"
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
        )}

        {/* Non-admin "What would you like to do?" section */}
        {isNonAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">What would you like to do?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.button
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.04 }}
                    onClick={() => navigate(feature.path)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted border border-transparent hover:border-border transition-all text-left group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
                      <feature.icon className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} delay={index * 0.08} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Booking / Trip Summary Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Trip Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Scheduled Trips</p>
                    <p className="text-3xl font-bold text-foreground">{totalTrips}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total in system</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Active Trips</p>
                    <p className="text-3xl font-bold text-foreground">{activeTrips}</p>
                    <p className="text-xs text-muted-foreground mt-1">Currently running</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Your Bookings</p>
                    <p className="text-3xl font-bold text-foreground">{totalBookings}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total bookings made</p>
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
                <h2 className="text-lg font-semibold text-foreground mb-4">User Summary</h2>
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
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Revenue</p>
                    <p className="text-3xl font-bold text-foreground">{totalRevenue}</p>
                    <p className="text-xs text-muted-foreground mt-1">From bookings</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Admin Quick Actions */}
            {user?.role === "system_admin" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-1">
                    {adminQuickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => navigate(action.path)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left group"
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
            )}

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Bookings</h3>
                  {isPassenger && (
                    <button
                      onClick={() => navigate("/my-bookings")}
                      className="text-xs text-primary hover:underline"
                    >
                      View all
                    </button>
                  )}
                </div>
                {myBookings.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No bookings yet</p>
                    {isPassenger && (
                      <button
                        onClick={() => navigate("/trips-discovery")}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        Browse trips →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                      >
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {booking.trip?.origin || "—"} → {booking.trip?.destination || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.trip?.scheduled_start_time
                              ? `${formatDate(booking.trip.scheduled_start_time)} · ${formatTime(booking.trip.scheduled_start_time)}`
                              : ""}
                          </p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize
                            ${booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                              booking.status === "reserved" || booking.status === "payment_pending" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"}`}>
                            {booking.status?.replace(/_/g, " ")}
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

        {/* Backend Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Backend Status</p>
                <p className="text-base font-semibold text-foreground">{backendStatus}</p>
              </div>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                backendStatus === "Online" ? "bg-emerald-500 text-white" :
                backendStatus === "Offline" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
              }`}>
                {backendStatus === "Online" ? <CheckCircle className="h-4.5 w-4.5" /> :
                 backendStatus === "Offline" ? <XCircle className="h-4.5 w-4.5" /> :
                 <Loader2 className="h-4.5 w-4.5 animate-spin" />}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Available Features - only for admins (non-admin users see the focused section above) */}
        {!isNonAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Available Features</h2>
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
                          <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => navigate(feature.path)}>Open</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
