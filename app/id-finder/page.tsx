import { DashboardLayout } from "@/components/layout";
import { IdFinder } from "@/components/id-finder";

export default function FindIdsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Find Patient and Doctor IDs</h1>
        <p className="text-muted-foreground">
          Use this page to find valid patient and doctor IDs to use in your appointment forms.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <IdFinder />
        </div>
      </div>
    </DashboardLayout>
  );
}
