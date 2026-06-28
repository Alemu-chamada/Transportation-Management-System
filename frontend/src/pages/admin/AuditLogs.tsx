import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MainLayout } from "../../routes/MainLayout";
import { DataTable, Column } from "../../shared/ui/DataTable";
import { SearchBar } from "../../shared/ui/SearchBar";
import { FilterPanel } from "../../shared/ui/FilterPanel";
import { Loader2 } from "lucide-react";
import { adminApi } from "../../features/admin/services";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetUser: string;
  details: string;
}

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    loadLogs();
  }, [page, selectedAction]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (selectedAction !== "all") params.action = selectedAction;
      const data = await adminApi.getAuditLogs(params);
      const raw = data?.logs || data?.audit_logs || [];
      const mapped: AuditLog[] = raw.map((l: any) => ({
        id: l.id?.toString() || String(Math.random()),
        timestamp: l.created_at
          ? new Date(l.created_at).toLocaleString()
          : "—",
        actor: l.actor_email || l.actor_id?.slice?.(0, 8) || "system",
        action: l.action || "—",
        targetUser: l.target_user_id?.slice?.(0, 8) || l.entity_type || "—",
        details: l.metadata ? JSON.stringify(l.metadata) : l.entity_id || "—",
      }));
      setLogs(mapped);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns: Column<AuditLog>[] = [
    { key: "timestamp", label: "Timestamp" },
    {
      key: "actor",
      label: "Actor",
      render: (log) => (
        <span className={log.actor === "system" ? "text-muted-foreground italic" : "text-foreground"}>
          {log.actor}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (log) => <span className="font-medium text-foreground">{log.action}</span>,
    },
    { key: "targetUser", label: "Entity / Target" },
    {
      key: "details",
      label: "Details",
      render: (log) => (
        <span className="text-xs text-muted-foreground max-w-xs truncate block">{log.details}</span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and security audit trail</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <FilterPanel>
            <div className="flex-1 min-w-[250px]">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search logs..." />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Action Type</label>
              <select
                value={selectedAction}
                onChange={(e) => { setSelectedAction(e.target.value); setPage(1); }}
                className="px-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Actions</option>
                {["LOGIN_SUCCESS", "LOGOUT", "OTP_SENT", "OTP_VERIFIED", "ROLE_CHANGED",
                  "BOOKING_CREATED", "BOOKING_CANCELLED", "PAYMENT_SUCCESS", "PAYMENT_FAILURE"].map(a => (
                  <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </FilterPanel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={filteredLogs} emptyMessage="No audit logs found" />
              {/* Pagination */}
              {logs.length === limit && (
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors">
                    ← Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-muted-foreground">Page {page}</span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
