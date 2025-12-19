// CSV export utility
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[]
) {
  if (data.length === 0) return;

  const headers = columns.map(c => c.header).join(',');
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      // Handle values that might contain commas or quotes
      const stringValue = String(value ?? '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export clients
export function exportClients(clients: Array<{
  name: string;
  phone: string;
  email: string;
  address: string;
  dateAdded: string;
  notes: string;
  projectId?: string;
}>) {
  exportToCSV(clients, 'clients', [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'address', header: 'Address' },
    { key: 'dateAdded', header: 'Date Added' },
    { key: 'notes', header: 'Notes' },
    { key: 'projectId', header: 'Project ID' },
  ]);
}

// Export labours
export function exportLabours(labours: Array<{
  name: string;
  phone: string;
  address: string;
  dateJoined: string;
  status: string;
  notes: string;
  projectId?: string;
}>) {
  exportToCSV(labours, 'labours', [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'address', header: 'Address' },
    { key: 'dateJoined', header: 'Date Joined' },
    { key: 'status', header: 'Status' },
    { key: 'notes', header: 'Notes' },
    { key: 'projectId', header: 'Project ID' },
  ]);
}

// Export resources
export function exportResources(resources: Array<{
  type: string;
  quantityPurchased: number;
  used: number;
  remaining: number;
  price: number;
  notes: string;
  projectId?: string;
}>) {
  exportToCSV(resources, 'resources', [
    { key: 'type', header: 'Type' },
    { key: 'quantityPurchased', header: 'Quantity Purchased' },
    { key: 'used', header: 'Used' },
    { key: 'remaining', header: 'Remaining' },
    { key: 'price', header: 'Price (₹)' },
    { key: 'notes', header: 'Notes' },
    { key: 'projectId', header: 'Project ID' },
  ]);
}

// Export projects
export function exportProjects(projects: Array<{
  name: string;
  location: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
  clientIds: string[];
  labourIds: string[];
  resourceIds: string[];
}>) {
  const projectsWithCounts = projects.map(p => ({
    ...p,
    clientCount: p.clientIds.length,
    labourCount: p.labourIds.length,
    resourceCount: p.resourceIds.length,
  }));

  exportToCSV(projectsWithCounts, 'projects', [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    { key: 'description', header: 'Description' },
    { key: 'status', header: 'Status' },
    { key: 'progress', header: 'Progress (%)' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'budget', header: 'Budget (₹)' },
    { key: 'clientCount', header: 'Clients' },
    { key: 'labourCount', header: 'Labours' },
    { key: 'resourceCount', header: 'Resources' },
    { key: 'notes', header: 'Notes' },
  ]);
}
