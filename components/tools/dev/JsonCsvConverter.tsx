'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, ArrowRight, Copy, Check, RotateCcw, FileJson, Settings2, Download, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'csv-to-json' | 'json-to-csv';

const JsonCsvConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const csvToJson = React.useCallback((csvData: string) => {
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return '';

    const result = [];
    const headers = hasHeader ? lines[0].split(delimiter).map(h => h.trim()) : [];
    const startIdx = hasHeader ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(delimiter);

      if (hasHeader) {
        headers.forEach((header, index) => {
          obj[header] = currentline[index]?.trim() || '';
        });
        result.push(obj);
      } else {
        result.push(currentline.map(item => item.trim()));
      }
    }
    return JSON.stringify(result, null, 2);
  }, [delimiter, hasHeader]);

  const jsonToCsv = React.useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a JSON array');
      }

      if (parsed.length === 0) return '';

      const isArrayOfObjects = typeof parsed[0] === 'object' && parsed[0] !== null && !Array.isArray(parsed[0]);
      
      if (isArrayOfObjects) {
        const headers = Object.keys(parsed[0]);
        const rows = parsed.map(obj => 
          headers.map(header => {
            const val = obj[header];
            const cell = val === null || val === undefined ? '' : String(val);
            return cell.includes(delimiter) || cell.includes('"') || cell.includes('\n') 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell;
          }).join(delimiter)
        );
        return [headers.join(delimiter), ...rows].join('\n');
      } else {
        // Assume array of arrays
        return parsed.map(row => 
          Array.isArray(row) 
            ? row.map(item => {
                const cell = String(item);
                return cell.includes(delimiter) || cell.includes('"') || cell.includes('\n') 
                  ? `"${cell.replace(/"/g, '""')}"` 
                  : cell;
              }).join(delimiter)
            : String(row)
        ).join('\n');
      }
    } catch (err: any) {
      throw new Error('Invalid JSON format for CSV conversion. Expecting an array of objects.');
    }
  }, [delimiter]);

  const convert = React.useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      if (mode === 'csv-to-json') {
        setOutput(csvToJson(input));
      } else {
        setOutput(jsonToCsv(input));
      }
    } catch (err: any) {
      setError(err.message || 'Conversion failed. Please check your data format.');
    }
  }, [input, mode, csvToJson, jsonToCsv]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = mode === 'csv-to-json' ? 'json' : 'csv';
    const mimeType = mode === 'csv-to-json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Mode Toggle & Settings */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-sm font-bold"
          >
            <ArrowLeftRight size={16} />
            Switch to {mode === 'csv-to-json' ? 'JSON to CSV' : 'CSV to JSON'}
          </button>

          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          <div className="flex items-center gap-3">
            <Settings2 size={18} className="text-white/40" />
            <span className="text-sm text-white/60 font-medium">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="	">Tab (\t)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>

        {mode === 'csv-to-json' && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${hasHeader ? 'bg-red-500' : 'bg-white/10'}`}
              onClick={() => setHasHeader(!hasHeader)}
            >
              <motion.div animate={{ x: hasHeader ? 20 : 0 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">First row is header</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              {mode === 'csv-to-json' ? <FileSpreadsheet size={14} className="text-green-400" /> : <FileJson size={14} className="text-blue-400" />}
              {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'csv-to-json' 
              ? "name,age,city\nJohn,30,New York\nJane,25,London" 
              : '[\n  {"name": "John", "age": 30},\n  {"name": "Jane", "age": 25}\n]'}
            className="w-full h-96 bg-black/30 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm text-white/80 leading-relaxed custom-scrollbar"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              {mode === 'csv-to-json' ? <FileJson size={14} className="text-blue-400" /> : <FileSpreadsheet size={14} className="text-green-400" />}
              {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={!output}
                className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className="w-full h-96 bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-sm overflow-auto custom-scrollbar whitespace-pre text-white/90">
            {error ? (
              <div className="text-red-400 flex items-center gap-2">
                <RotateCcw size={14} />
                {error}
              </div>
            ) : output || <span className="text-white/10 italic">Result will appear here...</span>}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <ArrowLeftRight size={18} className="text-red-400" />
          JSON / CSV Bi-directional Converter
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          {mode === 'csv-to-json' 
            ? "Converting CSV (Comma Separated Values) to JSON is essential for web developers working with data exports from Excel or Google Sheets. This tool automatically handles data parsing and formatting." 
            : "Converting JSON to CSV allows you to export your data into a format compatible with spreadsheet software like Excel, Numbers, or Google Sheets."}
          <br /><br />
          The tool supports custom delimiters and properly handles escaped characters and line breaks in data cells.
        </p>
      </div>
    </div>
  );
};

export default JsonCsvConverter;
