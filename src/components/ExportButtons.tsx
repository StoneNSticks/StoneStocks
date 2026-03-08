/**
 * Phase 75-76: Export utilities — PDF report and universal CSV export
 */
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export function ExportCSVButton({ data, filename, columns }: { data: any[]; filename: string; columns: { key: string; label: string }[] }) {
  const { lang } = useLanguage();

  const exportCSV = () => {
    if (!data || data.length === 0) {
      toast.error(lang === "de" ? "Keine Daten zum Exportieren" : "No data to export");
      return;
    }
    const header = columns.map(c => c.label).join(",");
    const rows = data.map(row => columns.map(c => {
      const val = row[c.key];
      return typeof val === "string" && val.includes(",") ? `"${val}"` : val ?? "";
    }).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lang === "de" ? "CSV exportiert!" : "CSV exported!");
  };

  return (
    <Button variant="ghost" size="sm" onClick={exportCSV} className="gap-1.5 text-muted-foreground">
      <Download className="h-3.5 w-3.5" />
      CSV
    </Button>
  );
}

export function ExportJSONButton({ data, filename }: { data: any; filename: string }) {
  const { lang } = useLanguage();

  const exportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lang === "de" ? "JSON exportiert!" : "JSON exported!");
  };

  return (
    <Button variant="ghost" size="sm" onClick={exportJSON} className="gap-1.5 text-muted-foreground">
      <FileText className="h-3.5 w-3.5" />
      JSON
    </Button>
  );
}
