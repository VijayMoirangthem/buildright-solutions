import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('clients');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = (format: string) => {
    toast.success(`${format.toUpperCase()} report generated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Generate and export business reports</p>
      </div>

      {/* Report Configuration */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clients">Clients Report</SelectItem>
                  <SelectItem value="labours">Labours Report</SelectItem>
                  <SelectItem value="resources">Resources Report</SelectItem>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          onClick={() => handleExport('excel')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
              <FileSpreadsheet className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Export to Excel</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download report as .xlsx file
            </p>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Excel
            </Button>
          </CardContent>
        </Card>

        <Card
          className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          onClick={() => handleExport('pdf')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-danger/10 flex items-center justify-center mb-4 group-hover:bg-danger/20 transition-colors">
              <FileText className="w-8 h-8 text-danger" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Export to PDF</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download report as .pdf file
            </p>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card
          className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
          onClick={() => handleExport('word')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <File className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Export to Word</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download report as .docx file
            </p>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Word
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview Placeholder */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Report Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">
                Select report type and date range to preview
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
