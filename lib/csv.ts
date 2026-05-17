import Papa from 'papaparse';
import type { ParsedData } from '@/types/analysis';

export async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => {
        const raw = result.data as string[][];
        if (!raw || raw.length === 0) {
          reject(new Error('Empty or invalid CSV file'));
          return;
        }
        const headers = raw[0].map((h) => String(h).trim());
        const rows = raw.slice(1).filter((r) => r.some((c) => c !== ''));
        resolve({ headers, rows, totalRows: rows.length });
      },
      error: (err) => reject(new Error(err.message)),
      skipEmptyLines: true,
    });
  });
}

export async function parseExcel(file: File): Promise<ParsedData> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const raw: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];

  if (!raw || raw.length === 0) throw new Error('Empty or invalid Excel file');

  const headers = raw[0].map((h) => String(h).trim());
  const rows = raw.slice(1).filter((r) => r.some((c) => String(c).trim() !== ''));

  return { headers, rows: rows.map((r) => r.map(String)), totalRows: rows.length };
}

export async function parseFile(file: File): Promise<ParsedData> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCSV(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);
  throw new Error(`Unsupported file type: .${ext}`);
}

export function getSampleRows(data: ParsedData, n = 20): string[][] {
  return data.rows.slice(0, n);
}

export function inferColumnTypes(headers: string[], rows: string[][]): Record<string, string> {
  const types: Record<string, string> = {};
  headers.forEach((h, i) => {
    const values = rows.map((r) => r[i]).filter(Boolean);
    if (values.every((v) => !isNaN(Number(v)))) { types[h] = 'number'; return; }
    if (values.every((v) => !isNaN(Date.parse(v)))) { types[h] = 'date'; return; }
    if (values.every((v) => ['true', 'false', '0', '1', 'yes', 'no'].includes(v.toLowerCase()))) {
      types[h] = 'boolean'; return;
    }
    types[h] = 'string';
  });
  return types;
}
