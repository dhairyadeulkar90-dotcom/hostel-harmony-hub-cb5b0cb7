import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ComplaintCard } from '@/components/ComplaintCard';
import { StatsCard } from '@/components/StatsCard';
import { NewComplaintDialog } from '@/components/NewComplaintDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockComplaints } from '@/data/mockData';
import { Complaint, ComplaintCategory, ComplaintPriority } from '@/types/complaint';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(
    mockComplaints.filter(c => c.studentId === '1') // Filter for current student
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleNewComplaint = (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
  }) => {
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      ...data,
      status: 'submitted',
      studentId: user?.id || '1',
      studentName: user?.name || 'Student',
      roomNumber: user?.roomNumber || '101',
      hostelBlock: user?.hostelBlock || 'Block A',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['submitted', 'assigned', 'in-progress'].includes(c.status);
    if (activeTab === 'resolved') return ['resolved', 'closed'].includes(c.status);
    return true;
  });

  const stats = {
    total: complaints.length,
    active: complaints.filter(c => ['submitted', 'assigned', 'in-progress'].includes(c.status)).length,
    resolved: complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length,
    pending: complaints.filter(c => c.status === 'submitted').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              {user?.hostelBlock}, Room {user?.roomNumber}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={Clock}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={AlertCircle}
          />
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredComplaints.length > 0 ? (
                <div className="grid gap-4">
                  {filteredComplaints.map(complaint => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">No complaints found</h3>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'all' 
                      ? "You haven't submitted any complaints yet."
                      : `No ${activeTab} complaints at the moment.`}
                  </p>
                  {activeTab === 'all' && (
                    <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Your First Complaint
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <NewComplaintDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleNewComplaint}
      />
    </div>
  );
}
