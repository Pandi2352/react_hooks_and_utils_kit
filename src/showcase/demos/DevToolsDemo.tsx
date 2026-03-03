import { useState, useEffect } from "react";
import { 
  generateHash, generateUUID, generatePassword, calculateChmod, 
  generateLorem, getQRCodeUrl, buildCron, ipRange,
  hexToRgb, rgbToHsl
} from "../../utils/devTools";

function ToolCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">{title}</label>
      {children}
    </div>
  );
}

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

export function HashGeneratorDemo() {
  const [input, setInput] = useState("Antigravity");
  const [hash, setHash] = useState("");
  useEffect(() => { generateHash(input).then(setHash); }, [input]);

  return (
    <ToolCard title="SHA-256 Hash Generator">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-2 text-sm border rounded focus:ring-2 focus:ring-violet-500/20" />
        <button onClick={() => copyToClipboard(hash)} className="px-3 py-1 bg-gray-100 text-xs rounded border">Copy</button>
      </div>
      <div className="p-3 bg-gray-900 text-violet-400 font-mono text-xs rounded break-all select-all">{hash}</div>
    </ToolCard>
  );
}

export function UUIDDemo() {
  const [uuid, setUuid] = useState(generateUUID());
  return (
    <ToolCard title="UUID v4 Generator">
      <div className="flex gap-2">
        <code className="flex-1 p-2 bg-white border rounded text-xs font-bold">{uuid}</code>
        <button onClick={() => setUuid(generateUUID())} className="px-3 py-1 bg-violet-600 text-white rounded text-xs">New</button>
      </div>
    </ToolCard>
  );
}

export function PasswordDemo() {
  const [pass, setPass] = useState(() => generatePassword());
  const [length, setLength] = useState(16);
  return (
    <ToolCard title="Password Generator">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <input type="range" min="8" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="flex-1" />
          <span className="text-xs font-bold text-gray-500">{length} Chars</span>
        </div>
        <div className="flex gap-2">
          <code className="flex-1 p-2 bg-gray-100 rounded text-xs font-mono truncate">{pass}</code>
          <button onClick={() => setPass(generatePassword(length))} className="px-3 bg-violet-600 text-white rounded text-xs">Regen</button>
        </div>
      </div>
    </ToolCard>
  );
}

export function QRCodeDemo() {
  const [data, setData] = useState("smart-hooks.com");
  return (
    <ToolCard title="QR Code Generator">
      <div className="flex flex-col items-center gap-4">
        <input value={data} onChange={e => setData(e.target.value)} className="w-full p-2 text-sm border rounded" placeholder="URL or Text" />
        <div className="p-2 bg-white border rounded shadow-sm">
          <img src={getQRCodeUrl(data)} alt="QR Code" className="w-32 h-32" />
        </div>
      </div>
    </ToolCard>
  );
}

export function ChmodDemo() {
  const [o, setO] = useState(7);
  const [g, setG] = useState(5);
  const [p, setP] = useState(5);
  const res = calculateChmod(o, g, p);
  return (
    <ToolCard title="Chmod Calculator">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[setO, setG, setP].map((fn, i) => (
             <select key={i} value={[o, g, p][i]} onChange={e => fn(Number(e.target.value))} className="p-1 text-xs border rounded">
                <option value="7">7 (rwx)</option>
                <option value="6">6 (rw-)</option>
                <option value="5">5 (r-x)</option>
                <option value="4">4 (r--)</option>
                <option value="0">0 (---)</option>
             </select>
          ))}
        </div>
        <div className="flex justify-between p-3 bg-violet-50 border border-violet-100 rounded text-violet-700 font-bold font-mono">
          <span>{res.octal}</span>
          <span>{res.symbolic}</span>
        </div>
      </div>
    </ToolCard>
  );
}

export function LoremDemo() {
  const [count, setCount] = useState(1);
  const text = generateLorem(count);
  return (
    <ToolCard title="Lorem Ipsum">
      <div className="space-y-2">
        <input type="number" min="1" max="5" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full p-2 text-sm border rounded" />
        <div className="p-3 bg-white border rounded text-[10px] text-gray-500 max-h-32 overflow-y-auto italic">
          {text}
        </div>
      </div>
    </ToolCard>
  );
}

export function IPCalcDemo() {
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const res = ipRange(cidr);
  return (
    <ToolCard title="IP / Subnet Calculator">
      <input value={cidr} onChange={e => setCidr(e.target.value)} className="w-full p-2 text-sm border rounded" />
      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
        <div className="p-2 bg-white border rounded">IP: {res.ip}</div>
        <div className="p-2 bg-white border rounded">Mask: /{res.mask}</div>
        <div className="p-2 bg-white border rounded">Hosts: {res.hosts}</div>
        <div className="p-2 bg-white border rounded">{res.type}</div>
      </div>
    </ToolCard>
  );
}

export function CronDemo() {
  const [min, setMin] = useState("0");
  const [hour, setHour] = useState("12");
  const exp = buildCron(min, hour);
  return (
    <ToolCard title="Cron Builder (Basic)">
      <div className="space-y-3">
        <div className="flex gap-2">
           <input value={min} onChange={e => setMin(e.target.value)} placeholder="Min" className="w-1/2 p-2 text-xs border rounded" />
           <input value={hour} onChange={e => setHour(e.target.value)} placeholder="Hour" className="w-1/2 p-2 text-xs border rounded" />
        </div>
        <div className="flex gap-1 justify-between">
          {exp.split(' ').map((v, i) => (
            <input key={i} value={v} className="w-1/5 p-2 text-center text-xs border rounded font-mono bg-violet-50 text-violet-600 font-bold" readOnly />
          ))}
        </div>
        <div className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-tighter">Min Hour Day Month Week</div>
      </div>
    </ToolCard>
  );
}

export function ColorConverterDemo() {
  const [hex, setHex] = useState("#0047AB");
  
  const rgbObj = hexToRgb(hex);
  const hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);

  const rgbStr = `${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}`;
  const hslStr = `${hslObj.h}, ${hslObj.s}, ${hslObj.l}`;

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-500/5">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Color Converter</h2>
        <p className="text-xs text-gray-500 font-medium">Convert colors between HEX, RGB, and HSL formats. Pick a color or type a value in any format.</p>
      </div>

      <div className="flex gap-4 items-start">
        {/* Color Picker Box */}
        <div className="w-24 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
            <span className="block text-[10px] font-black uppercase tracking-tight text-gray-400 mb-3 leading-tight">Pick a<br/>Color</span>
            <div className="relative w-12 h-12 mx-auto rounded-lg overflow-hidden border border-gray-100 shadow-inner">
                <input 
                    type="color" 
                    value={hex} 
                    onChange={(e) => setHex(e.target.value.toUpperCase())}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
            </div>
        </div>

        {/* Large Preview */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-28 w-full transition-colors duration-200" style={{ backgroundColor: hex }}></div>
            <div className="p-3 px-6 flex justify-center gap-6 bg-white border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-900 font-mono">{hex}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 font-mono">rgb({rgbStr})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 font-mono">hsl({hslStr})</span>
                </div>
            </div>
        </div>
      </div>

      {/* Input Rows */}
      <div className="space-y-3 pt-2">
        {/* HEX */}
        <div className="bg-white p-4 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200">
           <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2 tracking-widest">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                HEX
              </label>
              <button 
                onClick={() => copyToClipboard(hex)}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 border border-gray-50 px-3 py-1 rounded-lg bg-gray-50/50"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
              </button>
           </div>
           <input 
              value={hex} 
              onChange={e => setHex(e.target.value.toUpperCase())}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
           />
        </div>

        {/* RGB */}
        <div className="bg-white p-4 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200">
           <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2 tracking-widest">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                RGB
              </label>
              <button 
                onClick={() => copyToClipboard(`rgb(${rgbStr})`)}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 border border-gray-50 px-3 py-1 rounded-lg bg-gray-50/50"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
              </button>
           </div>
           <input 
              value={rgbStr} 
              readOnly
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 font-mono text-sm outline-none cursor-default"
           />
        </div>

        {/* HSL */}
        <div className="bg-white p-4 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200">
           <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2 tracking-widest">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                HSL
              </label>
              <button 
                onClick={() => copyToClipboard(`hsl(${hslStr})`)}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 border border-gray-50 px-3 py-1 rounded-lg bg-gray-50/50"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
              </button>
           </div>
           <input 
              value={hslStr} 
              readOnly
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 font-mono text-sm outline-none cursor-default"
           />
        </div>
      </div>
    </div>
  );
}

export default function DevToolsDemo() {
  return (
    <div className="space-y-6 pb-10">
      <ColorConverterDemo />
      <HashGeneratorDemo />

      <QRCodeDemo />
      <UUIDDemo />
      <PasswordDemo />
      <ChmodDemo />
      <LoremDemo />
      <IPCalcDemo />
      <CronDemo />
    </div>
  );
}
