import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Card } from '../shared/ui/Card';
import { Button } from '../shared/ui/Button';
import { MainLayout } from '../routes/MainLayout';
import { useAuth } from '../providers/AuthProvider';
import { profileApi } from '../features/profile/services';
import { Loader2, User, Mail, Phone, Shield, ArrowLeft } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  INCOMPLETE: { label: "Incomplete", className: "bg-gray-100 text-gray-600 border-gray-200" },
  PENDING_VERIFICATION: { label: "Pending Verification", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  COMPLETE: { label: "Complete", className: "bg-green-100 text-green-700 border-green-200" },
  VERIFIED: { label: "Verified", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  passenger: { label: "Passenger", className: "bg-sky-100 text-sky-700 border-sky-200" },
  driver: { label: "Driver", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  traffic_authority: { label: "Traffic Authority", className: "bg-amber-100 text-amber-700 border-amber-200" },
  garage_manager: { label: "Garage Manager", className: "bg-lime-100 text-lime-700 border-lime-200" },
  fuel_station_manager: { label: "Fuel Station Manager", className: "bg-orange-100 text-orange-700 border-orange-200" },
  system_admin: { label: "System Admin", className: "bg-primary/10 text-primary border-primary/20" },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setProfile(data.profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const roleConfig = user?.role ? ROLE_CONFIG[user.role] : null;
  const statusConfig = profile?.profile_status ? STATUS_CONFIG[profile.profile_status] : null;
  const isPassenger = user?.role === "passenger";

  const infoRows = [
    { icon: User, label: "Full Name", value: user?.full_name || "—" },
    { icon: Mail, label: "Email", value: user?.email || "—" },
    { icon: Phone, label: "Phone", value: user?.phone || "—" },
    { icon: Shield, label: "Role", value: roleConfig?.label || user?.role || "—", badge: roleConfig },
  ];

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-1">My Profile</h1>
          <p className="text-muted-foreground text-sm">View your account details</p>
        </motion.div>

        {/* Avatar + name card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-2xl font-bold text-white">{getInitials(user?.full_name)}</span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">{user?.full_name || "—"}</h2>
                <p className="text-muted-foreground text-sm mb-3">{user?.email || "—"}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {roleConfig && (
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${roleConfig.className}`}>
                      {roleConfig.label}
                    </span>
                  )}
                  {statusConfig && (
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Info rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Account Details</h2>
            <div className="divide-y divide-border">
              {infoRows.map(({ icon: Icon, label, value, badge }) => (
                <div key={label} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                    {badge ? (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badge.className}`}>
                        {value}
                      </span>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Profile data */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Role Profile</h2>
                {statusConfig && (
                  <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-semibold ${statusConfig.className}`}>
                    {statusConfig.label}
                  </span>
                )}
              </div>

              {profile.profile_data && Object.keys(profile.profile_data).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(profile.profile_data).map(([key, value]) => (
                    <div key={key} className="p-3.5 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{key.replace(/_/g, " ")}</p>
                      <p className="text-sm font-semibold text-foreground">{String(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No additional profile data.</p>
              )}

              {!isPassenger && profile.profile_status !== "VERIFIED" && (
                <div className="mt-4 p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-700 font-medium">
                    Complete your profile to unlock full access. Profile status: <strong>{statusConfig?.label || profile.profile_status}</strong>
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
