import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

type DashboardSummary = {
  totalRequests: number;
  pendingCount: number;
  confirmedCount: number;
  expiredCount: number;
  rejectedCount: number;
  confirmedRate: number;
  expiredRate: number;
  rejectedRate: number;
  averageResponseMinutes: number | null;
};

type ClinicOption = {
  id: string;
  name: string;
};

type ClinicSummary = DashboardSummary & {
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  averageResponseMinutes: number | null;
};

type PendingBooking = {
  bookingRef: string;
  patientName: string;
  treatmentType: string;
  preferredDate: string;
  timeSlot: string;
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  expiresAt: string | null;
  minutesRemaining: number | null;
};

type RejectionReasonSummary = {
  clinicId: number | null;
  clinicKey: string;
  clinicName: string;
  reason: string;
  count: number;
};

type DashboardPayload = {
  generatedAt: string;
  adminEmail: string;
  summary: DashboardSummary;
  clinicOptions: ClinicOption[];
  clinicSummaries: ClinicSummary[];
  pendingBookings: PendingBooking[];
  rejectionReasons: RejectionReasonSummary[];
};

const percentageTone = (rate: number, reverse = false) => {
  if (reverse) {
    if (rate >= 30) return 'text-rose-600';
    if (rate >= 15) return 'text-amber-600';
    return 'text-emerald-600';
  }

  if (rate >= 70) return 'text-emerald-600';
  if (rate >= 45) return 'text-amber-600';
  return 'text-rose-600';
};

const formatMinutesRemaining = (minutesRemaining: number | null) => {
  if (minutesRemaining === null) return 'No expiry set';
  if (minutesRemaining < 0) return `${Math.abs(minutesRemaining)} min overdue`;
  if (minutesRemaining < 60) return `${minutesRemaining} min left`;

  const hours = Math.floor(minutesRemaining / 60);
  const minutes = minutesRemaining % 60;
  return `${hours}h ${minutes}m left`;
};

const ALL_CLINICS_VALUE = 'all';

const AdminDashboard = () => {
  const { session, user, isLoading } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string>(ALL_CLINICS_VALUE);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!session) {
        return;
      }

      setIsFetching(true);
      setError(null);
      setErrorCode(null);

      try {
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const payload = await response.json();

        if (!response.ok) {
          setErrorCode(response.status);
          throw new Error(payload.error || 'Failed to load dashboard');
        }

        setDashboard(payload);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard');
      } finally {
        setIsFetching(false);
      }
    };

    if (!isLoading) {
      void loadDashboard();
    }
  }, [isLoading, session]);

  const selectedClinicKey = selectedClinic === ALL_CLINICS_VALUE ? null : selectedClinic;
  const selectedClinicSummary = selectedClinicKey === null
    ? dashboard?.summary ?? null
    : dashboard?.clinicSummaries.find((clinic) => clinic.clinicKey === selectedClinicKey) ?? null;
  const visiblePendingBookings = (dashboard?.pendingBookings ?? []).filter((booking) =>
    selectedClinicKey === null || booking.clinicKey === selectedClinicKey
  );
  const visibleRejectionReasons = (dashboard?.rejectionReasons ?? []).filter((reason) =>
    selectedClinicKey === null || reason.clinicKey === selectedClinicKey
  );
  const averageResponseText = selectedClinicSummary.averageResponseMinutes === null
    ? 'No responses yet'
    : `${selectedClinicSummary.averageResponseMinutes} min`;

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-slate-600">Loading OraChope Pulse...</div>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <Alert>
            <AlertTitle>Sign-in required</AlertTitle>
            <AlertDescription>
              Use your authenticated OraChope account before opening the admin dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <Alert variant={errorCode === 403 ? 'default' : 'destructive'}>
            <AlertTitle>{errorCode === 403 ? 'Access denied' : 'Dashboard unavailable'}</AlertTitle>
            <AlertDescription>
              {errorCode === 403
                ? 'This signed-in account is not registered in public.admin_users. Add the account there, then refresh.'
                : error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-3">
            <Button onClick={() => window.location.reload()}>Refresh</Button>
            <Button variant="outline" onClick={() => window.location.assign('/')}>Return home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard || !selectedClinicSummary) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <Alert>
            <AlertTitle>No dashboard data</AlertTitle>
            <AlertDescription>
              No booking data is available yet for the current admin account.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-8 py-10 text-white shadow-xl lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit bg-white/15 text-white hover:bg-white/15">
              OraChope Pulse
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Operational booking dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Track booking conversion, pending expiries, and clinic response quality from one secure admin view.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <div>Signed in as {dashboard.adminEmail}</div>
            <div>Updated {format(new Date(dashboard.generatedAt), 'dd MMM yyyy, hh:mm a')}</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clinic deep-dive</CardTitle>
            <CardDescription>
              Switch between the overall network pulse and a single clinic to pinpoint bottlenecks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger>
                  <SelectValue placeholder="All clinics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CLINICS_VALUE}>All clinics</SelectItem>
                  {dashboard.clinicOptions.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total requests</CardDescription>
              <CardTitle className="text-3xl">{selectedClinicSummary.totalRequests}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Pending now: {selectedClinicSummary.pendingCount}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Confirmed rate</CardDescription>
              <CardTitle className={`text-3xl ${percentageTone(selectedClinicSummary.confirmedRate)}`}>
                {selectedClinicSummary.confirmedRate}%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Confirmed bookings: {selectedClinicSummary.confirmedCount}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Expiry rate</CardDescription>
              <CardTitle className={`text-3xl ${percentageTone(selectedClinicSummary.expiredRate, true)}`}>
                {selectedClinicSummary.expiredRate}%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Expired bookings: {selectedClinicSummary.expiredCount}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Rejection rate</CardDescription>
              <CardTitle className={`text-3xl ${percentageTone(selectedClinicSummary.rejectedRate, true)}`}>
                {selectedClinicSummary.rejectedRate}%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Avg response: {averageResponseText}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Chaos monitor</CardTitle>
              <CardDescription>
                Pending bookings sorted by nearest expiry so you can intervene before they are lost.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Requested slot</TableHead>
                    <TableHead>Time remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiblePendingBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500">
                        No pending bookings in this view.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visiblePendingBookings.map((booking) => (
                      <TableRow key={booking.bookingRef}>
                        <TableCell>
                          <div className="font-medium text-slate-900">{booking.bookingRef}</div>
                          <div className="text-sm text-slate-500">{booking.patientName} · {booking.treatmentType}</div>
                        </TableCell>
                        <TableCell>{booking.clinicName}</TableCell>
                        <TableCell>
                          {format(new Date(booking.preferredDate), 'dd MMM yyyy')} · {booking.timeSlot}
                        </TableCell>
                        <TableCell className={booking.minutesRemaining !== null && booking.minutesRemaining <= 30 ? 'font-semibold text-rose-600' : 'text-slate-700'}>
                          {formatMinutesRemaining(booking.minutesRemaining)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejection analysis</CardTitle>
              <CardDescription>
                Repeated rejection reasons reveal process or capacity issues at a clinic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleRejectionReasons.length === 0 ? (
                <div className="text-sm text-slate-500">No rejected bookings in this view.</div>
              ) : (
                visibleRejectionReasons.map((reason) => (
                  <div key={`${reason.clinicId ?? 'unassigned'}-${reason.reason}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-slate-900">{reason.reason}</div>
                        <div className="text-sm text-slate-500">{reason.clinicName}</div>
                      </div>
                      <Badge variant="outline">{reason.count}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clinic performance snapshot</CardTitle>
            <CardDescription>
              Compare clinics by volume, conversion, expiry, and response speed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Confirmed</TableHead>
                  <TableHead>Expired</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Avg response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.clinicSummaries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500">
                      No clinic-level booking data yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboard.clinicSummaries.map((clinic) => (
                    <TableRow key={clinic.clinicKey}>
                      <TableCell className="font-medium">{clinic.clinicName}</TableCell>
                      <TableCell>{clinic.totalRequests}</TableCell>
                      <TableCell className={percentageTone(clinic.confirmedRate)}>{clinic.confirmedRate}%</TableCell>
                      <TableCell className={percentageTone(clinic.expiredRate, true)}>{clinic.expiredRate}%</TableCell>
                      <TableCell className={percentageTone(clinic.rejectedRate, true)}>{clinic.rejectedRate}%</TableCell>
                      <TableCell>
                        {clinic.averageResponseMinutes === null ? 'No responses yet' : `${clinic.averageResponseMinutes} min`}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
