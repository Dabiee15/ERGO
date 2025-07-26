"use client";

import { useState } from "react";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";

export default function FileUpload() {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedData(results.data as any[]);
          setColumns(Object.keys(results.data[0]));
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setParsedData(jsonData as any[]);
      setColumns(Object.keys(jsonData[0]));
    } else {
      alert("Unsupported file type!");
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: parsedData }),
    });

    if (res.ok) alert("✅ Upload successful!");
    else alert("❌ Upload failed.");
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg border border-emerald-300 shadow-md rounded-3xl p-8 transition-all">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Upload Agent Data
        </h2>

        <label
          className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-400 rounded-xl bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100 transition-all duration-200 cursor-pointer"
        >
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <p className="text-emerald-600 font-medium">
            Click or drag to upload a file
          </p>
          {fileName && (
            <span className="text-xs text-emerald-500 mt-2">{fileName}</span>
          )}
        </label>

        {parsedData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-emerald-700 mb-3 text-center">
              Previewing First 10 Rows
            </h3>
            <div className="overflow-auto rounded-md border border-emerald-200 shadow-inner max-h-96">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-emerald-100 sticky top-0">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-2 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 10).map((row, idx) => (
                    <tr
                      key={idx}
                      className="odd:bg-white even:bg-emerald-50 hover:bg-emerald-100 transition"
                    >
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2 border-t border-emerald-100">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg"
                onClick={handleSubmit}
              >
                Upload to Database
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
