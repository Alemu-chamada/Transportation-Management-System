import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MainLayout } from "../routes/MainLayout";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import {
  MapPin,
  Navigation,
  Loader2,
  Wrench,
  Fuel,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { serviceApi } from "../features/service/services";

const FILTER_OPTIONS = [
  { value: null, label: "All", icon: LayoutGrid },
  { value: "garage", label: "Garages", icon: Wrench },
  { value: "fuel_station", label: "Fuel Stations", icon: Fuel },
];

const getCategoryIcon = (type: string) => {
  if (type === "garage") return Wrench;
  if (type === "fuel_station") return Fuel;
  return MapPin;
};

const getCategoryColor = (type: string) => {
  if (type === "garage") return "bg-blue-500";
  if (type === "fuel_station") return "bg-orange-500";
  return "bg-purple-500";
};

export function NearbyServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceApi.getAllServices();
        if (data?.services) setServices(data.services);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const filteredServices = filter ? services.filter((s) => s.type === filter) : services;

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Nearby Services</h1>
          <p className="text-muted-foreground">Find garages and fuel stations near you</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-5">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Filter by type</p>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map(({ value, label, icon: Icon }) => {
                const isActive = filter === value;
                return (
                  <button
                    key={label}
                    onClick={() => setFilter(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-muted text-foreground border-transparent hover:border-border hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-12 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground text-sm">Try a different filter or check back later.</p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const Icon = getCategoryIcon(service.type);
              const colorClass = getCategoryColor(service.type);
              const isActive: boolean | undefined = service.is_active;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.07 }}
                >
                  <Card className="overflow-hidden" hover>
                    <div className="h-36 bg-gradient-to-br from-muted via-muted/50 to-background flex items-center justify-center relative">
                      {isActive !== undefined && (
                        <div className="absolute top-3 right-3">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 text-xs font-semibold">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-semibold">
                              <XCircle className="h-3 w-3" /> Inactive
                            </span>
                          )}
                        </div>
                      )}
                      <div className={`${colorClass} h-14 w-14 rounded-full flex items-center justify-center shadow`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="font-bold text-foreground mb-0.5">{service.name}</h3>
                        <span className="text-xs text-muted-foreground font-medium capitalize">
                          {service.type === "garage" ? "Garage" : "Fuel Station"}
                        </span>
                      </div>
                      {service.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{service.address}</span>
                        </div>
                      )}
                      <Button
                        variant="secondary"
                        className="w-full"
                        size="sm"
                        onClick={() => alert(`Service: ${service.name}`)}
                      >
                        <Navigation className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
