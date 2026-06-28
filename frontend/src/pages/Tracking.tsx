import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MainLayout } from "../routes/MainLayout";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import {
  MapPin, Navigation, Loader2, Radio, CheckCircle,
  AlertCircle, Bus, ChevronDown, Crosshair,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { bookingApi } from "../features/booking/services";
import { apiService } from "../shared/services/api";

/* ─── Socket.IO loaded via CDN to avoid import issues ──────────────────── */
declare const io: any;

export function Tracking() {
  const { user } = useAuth();
  const isDriver   = user?.role === "driver";
  const isPassenger = user?.role === "passenger";

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Live Trip Tracking</h1>
          <p className="text-muted-foreground text-sm">
            {isDriver
              ? "Share your location so passengers can track you in real time."
              : "Select a booking to track your trip."}
          </p>
        </motion.div>

        {isDriver   && <DriverTracker />}
        {isPassenger && <PassengerTracker />}
        {!isDriver && !isPassenger && <AdminView />}
      </div>
    </MainLayout>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PASSENGER VIEW — select booked trip → see live location
   ══════════════════════════════════════════════════════════════════════════ */
function PassengerTracker() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(d => setBookings((d.bookings || []).filter((b: any) =>
        ["reserved", "payment_pending", "confirmed"].includes(b.status)
      )))
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => socketRef.current?.disconnect();
  }, []);

  const startTracking = (booking: any) => {
    socketRef.current?.disconnect();
    setSelectedBooking(booking);
    setLocation(null);
    setTracking(true);

    const token = apiService.getToken();
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1")
      .replace("/api/v1", "");

    const socket = (window as any).io
      ? (window as any).io(backendUrl, { auth: { token }, transports: ["websocket"] })
      : null;

    if (!socket) {
      setTracking(false);
      return;
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("track:subscribe", { trip_id: booking.trip_id });
    });

    socket.on("location:updated", (data: any) => {
      setLocation({ lat: data.latitude, lng: data.longitude, at: data.recorded_at });
    });

    socket.on("disconnect", () => setTracking(false));
    socket.on("connect_error", () => setTracking(false));
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Booking selector */}
      <Card className="p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bus className="h-5 w-5 text-primary" /> Select Your Trip
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">No active bookings</p>
            <p className="text-sm text-muted-foreground">
              Book a trip first to start tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => (
              <motion.button key={b.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => startTracking(b)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedBooking?.id === b.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 bg-card"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {b.trip?.origin || "—"} → {b.trip?.destination || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Seat {b.seat_number} ·{" "}
                        {b.trip?.scheduled_start_time
                          ? new Date(b.trip.scheduled_start_time).toLocaleString([], {
                              month: "short", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : "—"}
                      </p>
                      <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                        b.status === "reserved"  ? "bg-amber-100 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}>{b.status}</span>
                    </div>
                  </div>
                  {selectedBooking?.id === b.id && tracking && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Live
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </Card>

      {/* Live location display */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Card className="p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Live Location —{" "}
                {selectedBooking.trip?.origin} → {selectedBooking.trip?.destination}
              </h2>

              {!tracking && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Connecting to live tracking… Make sure the driver has started sharing their location.
                </div>
              )}

              {tracking && !location && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
                  <Radio className="h-4 w-4 flex-shrink-0 animate-pulse" />
                  Waiting for driver location updates…
                </div>
              )}

              {location && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    Driver is sharing location in real time
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Latitude</p>
                      <p className="text-lg font-bold text-foreground">{location.lat.toFixed(6)}°</p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Longitude</p>
                      <p className="text-lg font-bold text-foreground">{location.lng.toFixed(6)}°</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    Last updated: {new Date(location.at).toLocaleTimeString()}
                  </p>
                  {/* Map link */}
                  <a
                    href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DRIVER VIEW — share GPS location
   ══════════════════════════════════════════════════════════════════════════ */
function DriverTracker() {
  const [sharing, setSharing] = useState(false);
  const [tripId, setTripId] = useState("");
  const [trips, setTrips] = useState<any[]>([]);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const watchRef = useRef<number | null>(null);

  useEffect(() => {
    // load scheduled trips to pick from
    import("../features/trip/services").then(({ tripApi }) => {
      tripApi.getScheduledTrips()
        .then(d => setTrips(d.trips || []))
        .catch(console.error);
    });
    return () => {
      socketRef.current?.disconnect();
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, []);

  const startSharing = () => {
    if (!tripId) { setError("Please select a trip first."); return; }
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const token = apiService.getToken();
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1")
      .replace("/api/v1", "");

    const socket = (window as any).io
      ? (window as any).io(backendUrl, { auth: { token }, transports: ["websocket"] })
      : null;

    if (!socket) { setError("Socket connection unavailable."); return; }

    socketRef.current = socket;

    watchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPos({ lat: latitude, lng: longitude });
        socket.emit("location:update", { trip_id: tripId, latitude, longitude });
      },
      (err) => setError(`GPS error: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    setSharing(true);
  };

  const stopSharing = () => {
    socketRef.current?.disconnect();
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    setSharing(false);
    setPos(null);
  };

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
        <Crosshair className="h-5 w-5 text-primary" /> Share Your Location
      </h2>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!sharing ? (
        <div className="space-y-4">
          {/* Trip selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select your trip
            </label>
            {trips.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-xl">
                No scheduled trips found.
              </p>
            ) : (
              <select value={tripId} onChange={e => setTripId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Choose a trip…</option>
                {trips.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.origin} → {t.destination} ·{" "}
                    {new Date(t.scheduled_start_time).toLocaleString([], {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Button onClick={startSharing} className="w-full">
            <Radio className="h-4 w-4" />
            Start Sharing Location
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Your browser will ask for GPS permission. Passengers will see your location in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            Broadcasting live location to passengers
          </div>

          {pos && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                <p className="font-bold text-foreground">{pos.lat.toFixed(6)}°</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                <p className="font-bold text-foreground">{pos.lng.toFixed(6)}°</p>
              </div>
            </div>
          )}

          <Button variant="destructive" onClick={stopSharing} className="w-full">
            Stop Sharing
          </Button>
        </div>
      )}
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN VIEW — overview of active trips
   ══════════════════════════════════════════════════════════════════════════ */
function AdminView() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    import("../features/trip/services").then(({ tripApi }) => {
      tripApi.getScheduledTrips()
        .then(d => setTrips(d.trips || []))
        .catch(console.error);
    });
  }, []);

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Navigation className="h-5 w-5 text-primary" /> Scheduled Trips
      </h2>
      {trips.length === 0 ? (
        <p className="text-muted-foreground text-sm">No scheduled trips.</p>
      ) : (
        <div className="space-y-3">
          {trips.map((t: any) => (
            <div key={t.id} className="flex items-center gap-3 p-4 rounded-xl bg-muted">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">
                  {t.origin} → {t.destination}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(t.scheduled_start_time).toLocaleString()}
                </p>
              </div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
