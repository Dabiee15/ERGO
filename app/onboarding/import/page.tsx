"use client";

import { useState } from "react";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import { doc, updateDoc } from "firebase/firestore";
import { dbclient } from "@/lib/dbclient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getIdToken } = useAuth();
  const router = useRouter();

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setParsedData(results.data as any[]);
            setColumns(Object.keys(results.data[0]));
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          alert("Error parsing CSV file");
        }
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          if (jsonData.length > 0) {
            setParsedData(jsonData as any[]);
            setColumns(Object.keys(jsonData[0]));
          }
        } catch (error) {
          console.error("Excel parsing error:", error);
          alert("Error parsing Excel file");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please sign in to upload data");
      return;
    }

    if (parsedData.length === 0) {
      alert("No data to upload");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getIdToken();
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ data: parsedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      await updateDoc(doc(dbclient, "users", user.uid), {
        "onboarding.importFile": true,
      });

      alert(`Successfully uploaded ${result.count} records!`);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Something went wrong during upload");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg border border-emerald-300 shadow-md rounded-3xl p-8 transition-all">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Upload Agent Data
        </h2>

        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-400 rounded-xl bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100 transition-all duration-200 cursor-pointer">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <div className="text-center p-4">
            <p className="text-emerald-600 font-medium">
              Click or drag to upload a file
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: CSV, Excel (XLSX, XLS)
            </p>
            {fileName && (
              <span className="text-xs text-emerald-500 mt-2 block">
                Selected: {fileName}
              </span>
            )}
          </div>
        </label>

        {parsedData.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-emerald-700">
                Preview (First 10 Rows)
              </h3>
              <span className="text-sm text-gray-500">
                Total Rows: {parsedData.length}
              </span>
            </div>
            
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
                        <td
                          key={col}
                          className="px-4 py-2 border-t border-emerald-100"
                        >
                          {row[col] !== undefined ? String(row[col]) : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Uploading..." : "Upload to Database"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}