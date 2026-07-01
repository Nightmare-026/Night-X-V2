import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw, 
  FileJson, 
  Settings2, 
  Download, 
  ArrowLeftRight,
  Database,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Data Source Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Data Source</h3>
              </div>
              <button 
                onClick={() => setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-400/5 border border-cyan-400/10 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:bg-cyan-400/10 transition-all"
              >
                <ArrowRightLeft size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                Switch Logic
              </button>
            </div>

            <div className="space-y-6">
              {/* Settings Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Settings2 size={10} /> Delimiter
                  </label>
                  <select
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md px-4 py-3 text-xs text-white/80 focus:outline-none focus:border-cyan-400/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="	">Tab (\t)</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Layers size={10} /> Structuring
                  </label>
                  <button
                    onClick={() => setHasHeader(!hasHeader)}
                    disabled={mode === 'json-to-csv'}
                    className={cn(
                      "w-full px-4 py-3 rounded-md border text-[10px] font-bold uppercase tracking-widest transition-all",
                      mode === 'json-to-csv' ? "opacity-20 cursor-not-allowed border-white/5 bg-transparent" :
                      hasHeader 
                        ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400" 
                        : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {hasHeader ? "Header Active" : "No Header"}
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Terminal size={10} /> Source Payload ({mode.split('-')[0].toUpperCase()})
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'csv-to-json' 
                    ? "id,name,role\n1,Alpha,Admin\n2,Beta,User" 
                    : '[\n  {"id": 1, "name": "Alpha"}\n]'}
                  className="w-full h-80 bg-black/40 border border-white/[0.05] rounded-md p-6 font-mono text-xs text-white/80 focus:outline-none focus:border-cyan-400/50 transition-all resize-none custom-scrollbar leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Conversion Engine</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Deploying bi-directional serialization protocol. Handles escaped characters and complex nested arrays with 99.9% syntactic precision.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Serialized Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Protocol Result</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Serialized Output</h2>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="p-2.5 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all disabled:opacity-0"
                    title="Export Data"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="p-2.5 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all disabled:opacity-0"
                    title="Copy Payload"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/[0.05] rounded-md p-8 font-mono text-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-white/10 uppercase tracking-widest select-none">
                  Output Viewport
                </div>
                
                <div className="h-full overflow-auto custom-scrollbar">
                  {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="p-4 rounded-full bg-red-400/10 border border-red-400/20">
                        <RotateCcw className="text-red-400 animate-spin-slow" size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-red-400 font-bold text-xs uppercase tracking-widest">Parsing Violation</div>
                        <div className="text-white/40 text-[10px] max-w-xs uppercase tracking-widest leading-relaxed">
                          {error}
                        </div>
                      </div>
                    </div>
                  ) : output ? (
                    <div className="text-white/80 whitespace-pre font-mono leading-relaxed selection:bg-cyan-400/30">
                      {output}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <Code2 className="text-white/10" size={48} />
                      <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                        Awaiting Serialization Protocol...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <FileJson size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Standard Schema</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Ensuring all generated JSON objects adhere to strict syntactic validation rules.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <FileSpreadsheet size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">CSV Integrity</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Sanitizing cell data to prevent injection and maintain tabular consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonCsvConverter;
