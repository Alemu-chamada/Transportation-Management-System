import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MainLayout } from "../../routes/MainLayout";
import { Card } from "../../shared/ui/Card";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { MapPin, Users, Clock, Loader2, Navigation } from "lucide-react";
import { tripApi, type Trip } from "../../features/trip/services";

export function TrackingMonitor() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await tripApi.getScheduledTrips({ all: true });
        // Show active + scheduled trips for monitoring
        setTrips((data.trips || []).filter((t) => t.status === "active" || t.status === "scheduled"));
      } catch (err) {
        console.error("Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Refresh every 30 s for a near-real-time feel
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const activeTrips  = trips.filter((t) => t.status === "active");
  const scheduledTrips = trips.filter((t) => t.status === "scheduled");

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tracking Monitor</h1>
          <p className="text-muted-foreground">Real-time monitoring of active and scheduled trips</p>
        </motion.div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeTrips.length} Active
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
            <Clock className="h-3.5 w-3.5" />
            {scheduledTrips.length} Scheduled
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map placeholder */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="p-0 overflow-hidden">
                <div className="h-[540px] bg-gradient-to-br from-muted via-muted/50 to-background flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path d="M 10 50 Q 30 20, 50 50 T 90 50" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2,2" />
                      <path d="M 20 30 Q 50 60, 80 30" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2,2" />
                    </svg>
                  </div>

                  {/* Animated pins for each active trip */}
                  {activeTrips.slice(0, 6).map((trip, i) => {
                    const positions = [
                      { left: "20%", top: "30%" }, { left: "45%", top: "50%" },
                      { left: "70%", top: "35%" }, { left: "60%", top: "65%" },
                      { left: "30%", top: "60%" }, { left: "80%", top: "55%" },
                    ];
                    const pos = positions[i] || { left: "50%", top: "50%" };
                    return (
                      <motion.div key={trip.id} className="absolute" style={pos}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      >
                        <div className="h-6 w-6 bg-primary rounded-full border-2 border-white shadow-lg" title={`${trip.origin} → ${trip.destination}`} />
                      </motion.div>
                    );
                  })}

                  <div className="text-center z-10">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Navigation className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Live Map View</h3>
                    <p className="text-muted-foreground text-sm">
                      {activeTrips.length} active · {scheduledTrips.length} upcoming
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Trip list */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-4">
                  Trips ({trips.length})
                </h3>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : trips.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active or scheduled trips</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {trips.map((trip) => (
                      <div key={trip.id}
                        className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">
                              {trip.origin} → {trip.destination}
                            </p>
                          </div>
                          <StatusBadge status={trip.status} />
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            {formatDate(trip.scheduled_start_time)} · {formatTime(trip.scheduled_start_time)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            {trip.total_capacity} seats · {trip.currency || "ETB"} {trip.fare}
                          </div>
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
