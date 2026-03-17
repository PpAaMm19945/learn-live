import { TrendingUp } from "lucide-react";

export default function Progress() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
      <p className="text-muted-foreground">
        Track your family's learning journey across all topics and lessons.
      </p>
      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl border-dashed bg-card">
        <TrendingUp className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground max-w-sm">
          Progress tracking across lessons, topics, and exam results will appear here.
        </p>
      </div>
    </div>
  );
}