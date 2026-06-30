import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MainLayout } from "../../routes/MainLayout";
import { DataTable, Column } from "../../shared/ui/DataTable";
import { StatusBadge } from "../../shared/ui/StatusBadge";
import { SearchBar } from "../../shared/ui/SearchBar";
import { FilterPanel } from "../../shared/ui/FilterPanel";
import { MetricCard } from "../../shared/ui/MetricCard";
import { DollarSign, TrendingUp, XCircle, Clock, Loader2 } from "lucide-react";
import { adminApi } from "../../features/admin/services";

interface PaymentRow {
  id: string;
  transactionId: string;
  bookingRef: string;
  customer: string;
  amount: string;
  currency: string;
  status: string;
  gateway: string;
  route: string;
  date: string;
}

export function PaymentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllPayments();
        const payments = data?.payments || [];
        const mapped: PaymentRow[] = payments.map((p: any) => ({
          id: p.id,
          transactionId: p.idempotency_key?.slice(0, 16) || p.id.slice(0, 8).toUpperCase(),
          bookingRef: p.booking_id?.slice(0, 8).toUpperCase() || "—",
          customer: p.passenger_name || p.passenger_email || "—",
          amount: p.amount != null ? Number(p.amount).toLocaleString() : "—",
          currency: p.trip_currency || p.currency || "ETB",
          status: p.gateway_status || "pending",
          gateway: p.gateway_name || "—",
          route: p.origin && p.destination ? `${p.origin} → ${p.destination}` : "—",
          date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "—",
        }));
        setRows(mapped);
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "all" || r.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Derived metrics
  const total   = rows.reduce((s, r) => s + (parseFloat(r.amount.replace(/,/g, "")) || 0), 0);
  const success = rows.filter((r) => r.status === "success").length;
  const failed  = rows.filter((r) => r.status === "failed").length;
  const pending = rows.filter((r) => r.status === "pending").length;

  const metrics = [
    { label: "Total Revenue",  value: `ETB ${total.toLocaleString()}`, icon: DollarSign,  iconColor: "bg-emerald-500", trend: { value: "Live", isPositive: true } },
    { label: "Successful",     value: success.toString(),               icon: TrendingUp,  iconColor: "bg-green-500",   trend: { value: "Live", isPositive: true } },
    { label: "Failed",         value: failed.toString(),                icon: XCircle,     iconColor: "bg-red-500",     trend: { value: "Live", isPositive: false } },
    { label: "Pending",        value: pending.toString(),               icon: Clock,       iconColor: "bg-yellow-500" },
  ];

  const columns: Column<PaymentRow>[] = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "bookingRef",    label: "Booking Ref" },
    { key: "customer",      label: "Customer" },
    { key: "route",         label: "Route" },
    {
      key: "amount",
      label: "Amount",
      render: (r) => <span className="font-bold text-foreground">{r.currency} {r.amount}</span>,
    },
    { key: "gateway", label: "Gateway" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    { key: "date", label: "Date" },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Monitor payment transactions and revenue</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => <MetricCard key={m.label} {...m} delay={i * 0.1} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <FilterPanel>
            <div className="flex-1 min-w-[250px]">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search payments…" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </FilterPanel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={filtered} emptyMessage="No payments found" />
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
