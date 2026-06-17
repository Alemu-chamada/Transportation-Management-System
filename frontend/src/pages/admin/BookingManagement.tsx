import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MainLayout } from "../../routes/MainLayout";
import { DataTable, Column } from "../../shared/ui/DataTable";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { SearchBar } from "../../shared/ui/SearchBar";
import { FilterPanel } from "../../shared/ui/FilterPanel";
import { Eye, Loader2 } from "lucide-react";
import { bookingApi } from "../../features/booking/services";

interface BookingRow {
  id: string;
  bookingRef: string;
  passenger: string;
  route: string;
  seat: string;
  bookingStatus: string;
  date: string;
  fare: string;
}

export function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingStatus, setSelectedBookingStatus] = useState("all");
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await bookingApi.getMyBookings();
        const bookings = data?.bookings || [];
        const mapped: BookingRow[] = bookings.map((b: any) => ({
          id: b.id,
          bookingRef: b.id.slice(0, 8).toUpperCase(),
          passenger: b.passenger_id?.slice(0, 8) || "—",
          route: b.trip ? `${b.trip.origin} → ${b.trip.destination}` : "—",
          seat: b.seat_number?.toString() || "—",
          bookingStatus: b.status || "—",
          date: b.trip?.scheduled_start_time
            ? new Date(b.trip.scheduled_start_time).toLocaleDateString()
            : b.created_at
            ? new Date(b.created_at).toLocaleDateString()
            : "—",
          fare: b.trip?.fare != null
            ? `${b.trip.currency || "ETB"} ${b.trip.fare.toLocaleString()}`
            : "—",
        }));
        setRows(mapped);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedBookingStatus === "all" || row.bookingStatus === selectedBookingStatus;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<BookingRow>[] = [
    { key: "bookingRef", label: "Booking Ref" },
    { key: "passenger", label: "Passenger ID" },
    { key: "route", label: "Route" },
    { key: "date", label: "Date" },
    { key: "seat", label: "Seat" },
    { key: "fare", label: "Fare" },
    {
      key: "bookingStatus",
      label: "Status",
      render: (row) => <StatusBadge status={row.bookingStatus} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4 text-foreground" />
        </button>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Booking Management</h1>
          <p className="text-muted-foreground">Monitor and manage all trip bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FilterPanel>
            <div className="flex-1 min-w-[250px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search bookings..."
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Booking Status</label>
              <select
                value={selectedBookingStatus}
                onChange={(e) => setSelectedBookingStatus(e.target.value)}
                className="px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="reserved">Reserved</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="failed">Failed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </FilterPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredRows}
              emptyMessage="No bookings found"
            />
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
