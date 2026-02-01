import { useState } from 'react';
import { Header } from '@/components/Header';
import { ComplaintCard } from '@/components/ComplaintCard';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockComplaints, staffMembers } from '@/data/mockData';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => ['assigned', 'in-progress'].includes(c.status)).length,
    resolved: complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length,
    highPriority: complaints.filter(c => c.priority === 'high' && !['resolved', 'closed'].includes(c.status)).length,
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.roomNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'pending' && c.status === 'submitted') ||
                       (activeTab === 'active' && ['assigned', 'in-progress'].includes(c.status)) ||
                       (activeTab === 'resolved' && ['resolved', 'closed'].includes(c.status));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const handleStatusUpdate = (complaintId: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId 
        ? { ...c, status: newStatus, updatedAt: new Date() }
        : c
    ));
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAssign = (complaintId: string, assignee: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId 
        ? { ...c, assignedTo: assignee, status: 'assigned', updatedAt: new Date() }
        : c
    ));
    toast.success(`Assigned to ${assignee}`);
  };

  // Category distribution for analytics
  const categoryStats = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Pending Review"
            value={stats.submitted}
            icon={Clock}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
          />
          <StatsCard
            title="High Priority"
            value={stats.highPriority}
            icon={AlertTriangle}
            className={stats.highPriority > 0 ? 'border-destructive/50' : ''}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Complaints List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complaints Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.submitted})</TabsTrigger>
                <TabsTrigger value="active">Active ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {filteredComplaints.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredComplaints.map(complaint => (
                      <ComplaintCard 
                        key={complaint.id} 
                        complaint={complaint}
                        onClick={() => setSelectedComplaint(complaint)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No complaints found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your filters or search query.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Analytics */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Timer className="h-4 w-4" /> 3.5 days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Staff</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Users className="h-4 w-4" /> 7 teams
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">By Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-muted-foreground">{category}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Overdue Issues
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={selectedComplaint.status} />
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>
                <DialogTitle>{selectedComplaint.title}</DialogTitle>
                <DialogDescription>
                  {selectedComplaint.hostelBlock}, Room {selectedComplaint.roomNumber} • 
                  Submitted by {selectedComplaint.studentName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Update Status</label>
                    <Select 
                      value={selectedComplaint.status} 
                      onValueChange={(v) => handleStatusUpdate(selectedComplaint.id, v as ComplaintStatus)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Assign To</label>
                    <Select 
                      value={selectedComplaint.assignedTo || ''} 
                      onValueChange={(v) => handleAssign(selectedComplaint.id, v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map(staff => (
                          <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedComplaint.assignedTo && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Currently assigned to:</span>{' '}
                      {selectedComplaint.assignedTo}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
