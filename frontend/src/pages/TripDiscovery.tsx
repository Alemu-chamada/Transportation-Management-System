import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MainLayout } from "../routes/MainLayout";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { Input } from "../shared/ui/Input";
import { MapPin, Clock, Users, Search, Loader2, ArrowLeftRight, Calendar, DollarSign } from "lucide-react";
import { tripApi, type Trip } from "../features/trip/services";

export function TripDiscovery() {
  const navigate = useNavigate();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await tripApi.getScheduledTrips();
      if (data?.trips) setTrips(data.trips);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await tripApi.getNearbyTrips({ origin: searchFrom, destination: searchTo });
      if (data?.trips) setTrips(data.trips);
    } catch (error) {
      console.error('Failed to search trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setSearchFrom(searchTo);
    setSearchTo(searchFrom);
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Your Trip</h1>
          <p className="text-muted-foreground">Search and book your next journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Search Route</p>
            <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Origin city or station"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <button
                onClick={handleSwap}
                className="self-center md:self-end mb-0 md:mb-2 flex items-center justify-center h-9 w-9 rounded-xl bg-muted hover:bg-muted/80 transition-colors flex-shrink-0"
                title="Swap origin and destination"
              >
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Destination city or station"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search Trips
            </Button>
          </Card>
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Available Trips</h2>
            {!loading && trips.length > 0 && (
              <span className="text-sm text-muted-foreground">{trips.length} trip{trips.length !== 1 ? "s" : ""} found</span>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : trips.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No trips available</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or check back later for available trips.</p>
            </Card>
          ) : (
            trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.07 }}
              >
                <Card className="p-6" hover>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-foreground text-lg">{trip.origin} → {trip.destination}</p>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold">
                              Scheduled
                            </span>
                          </div>
                          {trip.route_description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{trip.route_description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm pl-12">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-foreground font-medium">{formatDate(trip.scheduled_start_time)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-foreground font-medium">{formatTime(trip.scheduled_start_time)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-foreground font-medium">{trip.total_capacity} seats</span>
                        </div>
                        {trip.fare != null && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">
                              {trip.currency || "ETB"} {trip.fare.toLocaleString()} / seat
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button onClick={() => navigate(`/trip/${trip.id}`)} variant="primary">
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
