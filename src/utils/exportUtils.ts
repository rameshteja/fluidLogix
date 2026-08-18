import { THEME_COLORS } from "./themeTokens";

export interface ExportColumn<T> {
  header: string;
  key?: keyof T;
  formatter?: (item: T) => string | number;
}

export interface ExportOptions<T> {
  filename: string;
  data: T[];
  columns: ExportColumn<T>[];
  title?: string;
  subtitle?: string;
  summaryStats?: Array<{ label: string; value: string | number }>;
  orientation?: "landscape" | "portrait";
}

/**
 * Reusable CSV Exporter with Excel UTF-8 BOM support
 */
export function exportToCSV<T>({
  filename,
  data,
  columns,
}: ExportOptions<T>): void {
  if (!data || data.length === 0) {
    console.warn("No data available for CSV export");
    return;
  }

  const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;

  // 1. Headers
  const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`);

  // 2. Rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value: unknown;
        if (col.formatter) {
          value = col.formatter(item);
        } else if (col.key) {
          value = item[col.key];
        }

        if (value === null || value === undefined) {
          return '""';
        }

        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",");
  });

  // UTF-8 BOM (\uFEFF) ensures proper rendering in Microsoft Excel & all operating systems
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, safeFilename);
}

/**
 * Reusable JSON Exporter
 */
export function exportToJSON<T>({
  filename,
  data,
  columns,
}: ExportOptions<T>): void {
  if (!data || data.length === 0) {
    console.warn("No data available for JSON export");
    return;
  }

  const safeFilename = filename.endsWith(".json") ? filename : `${filename}.json`;

  // Map to structured key-value pairs if columns are specified
  const formattedData = data.map((item) => {
    const rowObj: Record<string, unknown> = {};
    columns.forEach((col) => {
      if (col.formatter) {
        rowObj[col.header] = col.formatter(item);
      } else if (col.key) {
        rowObj[col.header] = item[col.key];
      }
    });
    return rowObj;
  });

  const jsonContent = JSON.stringify(formattedData, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  downloadBlob(blob, safeFilename);
}

/**
 * Reusable Branded PDF Generator & Downloader
 * Renders a high-resolution, print-ready document and triggers PDF print/save
 */
export function exportToPDF<T>({
  filename,
  data,
  columns,
  title = "FluidLogix Operational Report",
  subtitle = "Chemical & Water Transport Management Platform",
  summaryStats = [],
  orientation = "landscape",
}: ExportOptions<T>): void {
  if (!data || data.length === 0) {
    console.warn("No data available for PDF export");
    return;
  }

  const generatedDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generate table headers HTML
  const thHtml = columns
    .map(
      (col) =>
        `<th style="padding: 10px 12px; font-weight: 700; text-align: left; background-color: ${THEME_COLORS.brandNavy}; color: ${THEME_COLORS.primary}; border-bottom: 2px solid ${THEME_COLORS.primary}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${col.header}</th>`
    )
    .join("");

  // Generate table rows HTML
  const trHtml = data
    .map((item, index) => {
      const isEven = index % 2 === 0;
      const rowBg = isEven ? "#ffffff" : "#F8FAFC";

      const tdHtml = columns
        .map((col) => {
          let val = "";
          if (col.formatter) {
            val = String(col.formatter(item));
          } else if (col.key) {
            val = String(item[col.key] ?? "");
          }

          // Special status badge formatting
          let formattedCell = val;
          if (val === "Active" || val === "Completed") {
            formattedCell = `<span style="display:inline-block; padding: 2px 8px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-weight: 700; font-size: 10px;">${val}</span>`;
          } else if (val === "Transit" || val === "In Transit") {
            formattedCell = `<span style="display:inline-block; padding: 2px 8px; border-radius: 999px; background: #E0F2FE; color: #0369A1; font-weight: 700; font-size: 10px;">${val}</span>`;
          } else if (val === "Maintenance" || val === "Pending") {
            formattedCell = `<span style="display:inline-block; padding: 2px 8px; border-radius: 999px; background: #FEF3C7; color: #B45309; font-weight: 700; font-size: 10px;">${val}</span>`;
          } else if (val === "Idle" || val === "Cancelled") {
            formattedCell = `<span style="display:inline-block; padding: 2px 8px; border-radius: 999px; background: #F1F5F9; color: #64748B; font-weight: 700; font-size: 10px;">${val}</span>`;
          } else if (val === "Chemical" || val === "Hazardous") {
            const bg = val === "Chemical" ? "#FFF7ED" : "#FEF2F2";
            const color = val === "Chemical" ? "#C2410C" : "#B91C1C";
            formattedCell = `<span style="display:inline-block; padding: 2px 8px; border-radius: 6px; background: ${bg}; color: ${color}; font-weight: 700; font-size: 10px;">${val}</span>`;
          }

          return `<td style="padding: 9px 12px; font-size: 11px; color: #1E293B; border-bottom: 1px solid #E2E8F0; vertical-align: middle;">${formattedCell}</td>`;
        })
        .join("");

      return `<tr style="background-color: ${rowBg};">${tdHtml}</tr>`;
    })
    .join("");

  // Summary statistics pills HTML
  const summaryHtml =
    summaryStats.length > 0
      ? `<div style="display: flex; gap: 14px; margin-bottom: 18px; flex-wrap: wrap;">
          ${summaryStats
            .map(
              (stat) => `
            <div style="background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 14px; min-width: 120px;">
              <div style="font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase;">${stat.label}</div>
              <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-top: 2px;">${stat.value}</div>
            </div>`
            )
            .join("")}
        </div>`
      : "";

  const printableHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title} - FluidLogix</title>
      <style>
        @page {
          size: ${orientation};
          margin: 12mm 12mm 15mm 12mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: #ffffff;
          color: #0F172A;
        }
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid ${THEME_COLORS.primary};
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-box {
          background: ${THEME_COLORS.primary};
          color: ${THEME_COLORS.primaryForeground};
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
        }
        .brand-title {
          font-size: 20px;
          font-weight: 800;
          color: ${THEME_COLORS.brandNavy};
          line-height: 1;
        }
        .brand-tag {
          font-size: 10px;
          color: #64748B;
          font-weight: 600;
          margin-top: 2px;
        }
        .report-info {
          text-align: right;
        }
        .report-title {
          font-size: 18px;
          font-weight: 800;
          color: ${THEME_COLORS.brandNavy};
          margin: 0;
        }
        .report-sub {
          font-size: 11px;
          color: #64748B;
          margin-top: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4px;
        }
        .report-footer {
          margin-top: 24px;
          padding-top: 10px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: #94A3B8;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="brand-logo">
          <div class="logo-box">FL</div>
          <div>
            <div class="brand-title">FluidLogix</div>
            <div class="brand-tag">Transport Management Portal</div>
          </div>
        </div>
        <div class="report-info">
          <h1 class="report-title">${title}</h1>
          <div class="report-sub">${subtitle} • Generated: ${generatedDate}</div>
        </div>
      </div>

      ${summaryHtml}

      <table>
        <thead>
          <tr>
            ${thHtml}
          </tr>
        </thead>
        <tbody>
          ${trHtml}
        </tbody>
      </table>

      <div class="report-footer">
        <div>FluidLogix Logistics Platform • Confidential System Export</div>
        <div>Total Records: <strong>${data.length}</strong></div>
      </div>

      <script>
        window.onload = function() {
          window.focus();
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  // Create an invisible print iframe to trigger clean native PDF dialog
  const printIframe = document.createElement("iframe");
  printIframe.style.position = "fixed";
  printIframe.style.right = "0";
  printIframe.style.bottom = "0";
  printIframe.style.width = "0";
  printIframe.style.height = "0";
  printIframe.style.border = "0";
  document.body.appendChild(printIframe);

  const iframeDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(printableHtml);
    iframeDoc.close();

    // Clean up iframe after print dialog resolves
    setTimeout(() => {
      if (printIframe.parentNode) {
        printIframe.parentNode.removeChild(printIframe);
      }
    }, 4000);
  }
}

/**
 * Internal helper to trigger browser blob download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
