import { useState, useEffect } from "react";
import { 
  slugify, getInitials, formatCurrency, truncate, formatDate, range, generateId, compact, cn,
  capitalize, clamp, unique, isEmpty, pick, omit, formatFileSize, isValidEmail, randomInt, sortBy,
  formatTimestamp, toUnixTimestamp
} from "../../utils/helpers";

/**
 * Shared wrapper for demo sections
 */
function DemoSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm animate-in fade-in duration-500">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">{title}</label>
      {children}
    </div>
  );
}

function ResultCard({ label, value, colorClass = "text-indigo-600" }: { label: string, value: string, colorClass?: string }) {
  return (
    <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm transition-all hover:border-gray-300">
      <span className="block text-[10px] text-gray-400 uppercase font-medium mb-1">{label}</span>
      <code className={`text-sm font-semibold break-all ${colorClass}`}>{value}</code>
    </div>
  );
}

// Existing Demos...

export function DateDemo() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  return (
    <DemoSection title="Smart Date Formatter">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <ResultCard label="Full Date" value={formatDate(date)} colorClass="text-orange-600" />
        <ResultCard label="Numeric" value={formatDate(date, { month: '2-digit', day: '2-digit', year: 'numeric' })} />
        <ResultCard label="Weekday" value={formatDate(date, { weekday: 'long' })} />
      </div>
    </DemoSection>
  );
}

export function CurrencyDemo() {
  const [amount, setAmount] = useState(1234.56);
  return (
    <DemoSection title="Currency Global Formatter">
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <ResultCard label="USD" value={formatCurrency(amount, 'USD')} colorClass="text-green-600" />
        <ResultCard label="EUR" value={formatCurrency(amount, 'EUR', 'de-DE')} />
        <ResultCard label="INR" value={formatCurrency(amount, 'INR', 'en-IN')} />
      </div>
    </DemoSection>
  );
}

export function SlugifyDemo() {
  const [text, setText] = useState("Hello World!");
  return (
    <DemoSection title="Text Manipulation">
      <input value={text} onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <ResultCard label="Slug" value={slugify(text)} colorClass="text-blue-600" />
        <ResultCard label="Truncate (10)" value={truncate(text, 10)} />
      </div>
    </DemoSection>
  );
}

export function InitialsDemo() {
  const [name, setName] = useState("John Doe");
  const initials = getInitials(name);
  return (
    <DemoSection title="Initials Generator">
      <div className="flex gap-4 items-center">
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900" />
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{initials}</div>
      </div>
    </DemoSection>
  );
}

export function CnDemo() {
  const [active, setActive] = useState(false);
  const className = cn("p-4 rounded border transition-all", active ? "bg-blue-600 text-white" : "bg-gray-100");
  return (
    <DemoSection title="Class Merger (cn)">
      <button onClick={() => setActive(!active)} className="px-4 py-2 bg-gray-800 text-white rounded text-sm mb-4">Toggle State</button>
      <div className={className}>Visual Box</div>
      <code className="block mt-2 text-[10px] text-gray-500">Classes: {className}</code>
    </DemoSection>
  );
}

export function RangeDemo() {
  const [end, setEnd] = useState(5);
  return (
    <DemoSection title="Range Array">
      <input type="number" value={end} onChange={(e) => setEnd(Number(e.target.value))}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-900" />
      <div className="mt-2 p-3 bg-white border rounded text-xs font-mono">{JSON.stringify(range(0, end))}</div>
    </DemoSection>
  );
}

export function IdDemo() {
  const [id, setId] = useState(() => generateId("id"));
  return (
    <DemoSection title="ID Generator">
      <button onClick={() => setId(generateId("id"))} className="w-full py-2 bg-blue-600 text-white rounded font-bold">New ID</button>
      <div className="mt-2 text-center p-3 bg-gray-900 text-green-400 font-mono rounded">{id}</div>
    </DemoSection>
  );
}

export function CompactDemo() {
  const list = [0, 1, false, 2, "", 3, null];
  return (
    <DemoSection title="Compact Array">
      <div className="text-xs space-y-2">
        <div>Original: <code className="text-gray-400 line-through">{JSON.stringify(list)}</code></div>
        <div>Result: <code className="text-green-600 font-bold">{JSON.stringify(compact(list))}</code></div>
      </div>
    </DemoSection>
  );
}

// New Demos for the 10 additional functions

export function CapitalizeDemo() {
  const [text, setText] = useState("hello world");
  return (
    <DemoSection title="Capitalize Utility">
      <input value={text} onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300" />
      <ResultCard label="Result" value={capitalize(text)} />
    </DemoSection>
  );
}

export function ClampDemo() {
  const [val, setVal] = useState(50);
  return (
    <DemoSection title="Clamp Utility (0 - 100)">
      <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300" />
      <ResultCard label="Clamped (0-100)" value={clamp(val, 0, 100).toString()} />
    </DemoSection>
  );
}

export function UniqueDemo() {
  const [text, setText] = useState("1,2,2,3,4,4,5");
  const items = text.split(',').map(s => s.trim());
  return (
    <DemoSection title="Unique Values">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Comma separated values"
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300" />
      <ResultCard label="Unique Items" value={JSON.stringify(unique(items))} />
    </DemoSection>
  );
}

export function IsEmptyDemo() {
  const [text, setText] = useState("");
  return (
    <DemoSection title="IsEmpty Checker">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something..."
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300" />
      <div className={`p-4 rounded mt-2 text-center text-sm font-bold ${isEmpty(text) ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
        {isEmpty(text) ? "EMPTY" : "NOT EMPTY"}
      </div>
    </DemoSection>
  );
}

export function ObjectUtilsDemo() {
  const obj = { id: 1, name: "Antigravity", role: "AI", status: "active" };
  return (
    <DemoSection title="Object Utils (Pick & Omit)">
      <div className="space-y-3">
        <ResultCard label="Original Object" value={JSON.stringify(obj)} />
        <ResultCard label="Pick [id, name]" value={JSON.stringify(pick(obj, ['id', 'name']))} />
        <ResultCard label="Omit [status, role]" value={JSON.stringify(omit(obj, ['status', 'role']))} />
      </div>
    </DemoSection>
  );
}

export function FileSizeDemo() {
  const [bytes, setBytes] = useState(1048576);
  return (
    <DemoSection title="File Size Formatter">
      <input type="number" value={bytes} onChange={(e) => setBytes(Number(e.target.value))}
        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300" />
      <ResultCard label="Human Readable" value={formatFileSize(bytes)} colorClass="text-blue-600" />
    </DemoSection>
  );
}

export function EmailValidateDemo() {
  const [email, setEmail] = useState("test@example.com");
  const valid = isValidEmail(email);
  return (
    <DemoSection title="Email Validator">
      <input value={email} onChange={(e) => setEmail(e.target.value)}
        className={`w-full px-4 py-2.5 text-sm rounded-lg border ${valid ? 'border-gray-300' : 'border-red-500 focus:ring-red-500/20'}`} />
      <div className={`text-xs mt-1 font-bold ${valid ? 'text-green-600' : 'text-red-600'}`}>
        {valid ? "✓ Valid Email" : "✗ Invalid Email"}
      </div>
    </DemoSection>
  );
}

export function RandomIntDemo() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [val, setVal] = useState(() => randomInt(1, 100));
  return (
    <DemoSection title="Random Integer">
      <div className="flex gap-2">
        <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-1/2 p-2 border rounded" placeholder="Min" />
        <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-1/2 p-2 border rounded" placeholder="Max" />
      </div>
      <button onClick={() => setVal(randomInt(min, max))} className="w-full mt-2 py-2 bg-indigo-600 text-white rounded">Gernarate</button>
      <ResultCard label="Random Result" value={val.toString()} />
    </DemoSection>
  );
}

export function SortByDemo() {
  const list = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
  ];
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const sorted = sortBy(list, 'name', order);
  return (
    <DemoSection title="Sort By Property">
      <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} className="px-3 py-1 bg-gray-200 rounded text-xs mb-2">
        Sort {order === 'asc' ? 'Descending' : 'Ascending'}
      </button>
      <div className="space-y-1">
        {sorted.map(u => (
          <div key={u.name} className="p-2 bg-white border rounded text-xs flex justify-between">
            <span>{u.name}</span>
            <span className="text-gray-400">Age: {u.age}</span>
          </div>
        ))}
      </div>
    </DemoSection>
  );
}

export function UnixTimestampDemo() {
  const [now, setNow] = useState(new Date());
  const [unit, setUnit] = useState<'s' | 'ms'>('s');
  const [tz, setTz] = useState('UTC');
  const [inputTs, setInputTs] = useState("");
  const [mode, setMode] = useState<'ts2date' | 'date2ts'>('ts2date');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const convertedDate = inputTs ? formatTimestamp(Number(inputTs), unit, tz) : "—";

  return (
    <DemoSection title="Unix Timestamp Converter">
      <div className="space-y-6">
        {/* Mode Tabs */}
        <div className="flex p-1 bg-gray-200 rounded-lg w-fit">
          <button 
            onClick={() => setMode('ts2date')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'ts2date' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            Timestamp → Date
          </button>
          <button 
            onClick={() => setMode('date2ts')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'date2ts' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            Date → Timestamp
          </button>
        </div>

        {/* Settings Bar */}
        <div className="flex flex-wrap items-center gap-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Unit:</span>
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button onClick={() => setUnit('s')} className={`px-3 py-1 text-[10px] font-bold rounded ${unit === 's' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>Seconds</button>
              <button onClick={() => setUnit('ms')} className={`px-3 py-1 text-[10px] font-bold rounded ${unit === 'ms' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>Milliseconds</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Timezone:</span>
            <select value={tz} onChange={(e) => setTz(e.target.value)} className="text-xs bg-transparent border-none focus:ring-0 font-bold">
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (New York)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
              <option value="Asia/Kolkata">IST (India)</option>
            </select>
          </div>
        </div>

        {/* Live Counters */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Current Time
            </span>
            <span className="text-[10px] font-bold text-green-600 uppercase">● Live</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden">
               <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Seconds</span>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-mono font-bold text-gray-800">{toUnixTimestamp(now, 's')}</span>
                 <button onClick={() => copyToClipboard(toUnixTimestamp(now, 's').toString())} className="text-[10px] font-bold px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-100 transition-colors">Copy</button>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden">
               <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Milliseconds</span>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-mono font-bold text-gray-800">{toUnixTimestamp(now, 'ms')}</span>
                 <button onClick={() => copyToClipboard(toUnixTimestamp(now, 'ms').toString())} className="text-[10px] font-bold px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-100 transition-colors">Copy</button>
               </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Unix Timestamp ({unit === 's' ? 'seconds' : 'milliseconds'})</label>
          <div className="relative">
            <input 
              value={inputTs}
              onChange={(e) => setInputTs(e.target.value)}
              placeholder={`e.g. ${unit === 's' ? '1700000000' : '1700000000000'}`}
              className="w-full pl-4 pr-32 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono text-sm"
            />
            <button 
              onClick={() => setInputTs(toUnixTimestamp(new Date(), unit).toString())}
              className="absolute right-2 top-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Use Current Time
            </button>
          </div>
          
          {inputTs && (
             <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl animate-in zoom-in-95 duration-200">
               <span className="block text-[9px] font-bold text-indigo-400 uppercase mb-1">Human Readable Date ({tz})</span>
               <span className="text-sm font-bold text-indigo-900">{convertedDate}</span>
             </div>
          )}
        </div>

        {/* Infobox */}
        <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm text-xs text-gray-600">
          <h4 className="font-bold text-gray-900 mb-2">About Unix Timestamps</h4>
          <ul className="space-y-2 list-disc pl-4">
            <li>A Unix timestamp is the number of seconds (or milliseconds) elapsed since **January 1, 1970 00:00:00 UTC**.</li>
            <li>Seconds-based timestamps are typically **10 digits** long, while millisecond timestamps are **13 digits**.</li>
          </ul>
        </div>
      </div>
    </DemoSection>
  );
}

export default function UtilsDemo() {

  return (
    <div className="grid grid-cols-1 gap-6 pb-20">
      <DateDemo />
      <CurrencyDemo />
      <SlugifyDemo />
      <InitialsDemo />
      <CnDemo />
      <RangeDemo />
      <IdDemo />
      <CompactDemo />
      <CapitalizeDemo />
      <ClampDemo />
      <UniqueDemo />
      <IsEmptyDemo />
      <ObjectUtilsDemo />
      <FileSizeDemo />
      <EmailValidateDemo />
      <RandomIntDemo />
      <SortByDemo />
      <UnixTimestampDemo />
    </div>
  );
}

