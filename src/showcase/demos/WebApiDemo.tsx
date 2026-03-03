import { useState } from "react";
import { 
  useClipboard, useNetworkState, useBattery, useGeolocation, useVibrate, 
  useFullscreen, usePermission, useScript, useFavicon, useIntersectionObserver 
} from "../../hooks/webApis";

function DemoSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm animate-in fade-in duration-500">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">{title}</label>
      {children}
    </div>
  );
}

function StatusBadge({ label, value, active }: { label: string, value: string | number | null, active?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
      <span className="block text-[10px] text-gray-400 uppercase font-medium mb-1">{label}</span>
      <span className={`text-sm font-bold ${active ? 'text-emerald-600' : 'text-gray-600'}`}>{value ?? 'N/A'}</span>
    </div>
  );
}

export function ClipboardDemo() {
  const { text, copy } = useClipboard();
  const [input, setInput] = useState("Hello from Web APIs!");
  return (
    <DemoSection title="Clipboard API">
      <div className="flex gap-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-900"
        />
        <button 
          onClick={() => copy(input)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold"
        >
          Copy
        </button>
      </div>
      {text && <p className="text-xs text-emerald-600 font-medium">Last copied: {text}</p>}
    </DemoSection>
  );
}

export function NetworkDemo() {
  const state = useNetworkState();
  return (
    <DemoSection title="Network Information">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusBadge label="Online" value={state.online ? "YES" : "NO"} active={state.online} />
        <StatusBadge label="Type" value={state.effectiveType} />
        <StatusBadge label="Downlink" value={`${state.downlink} Mbps`} />
        <StatusBadge label="RTT" value={`${state.rtt} ms`} />
      </div>
    </DemoSection>
  );
}

export function BatteryDemo() {
  const battery = useBattery();
  if (!battery.supported) return <DemoSection title="Battery">Not supported in this browser</DemoSection>;
  return (
    <DemoSection title="Battery Status">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatusBadge label="Level" value={`${Math.round((battery.level || 0) * 100)}%`} active />
        <StatusBadge label="Charging" value={battery.charging ? "YES" : "NO"} active={battery.charging || false} />
        <StatusBadge label="Time Remaining" value={battery.dischargingTime === Infinity ? "Calculating..." : `${battery.dischargingTime}s`} />
      </div>
    </DemoSection>
  );
}

export function GeolocationDemo() {
  const geo = useGeolocation();
  return (
    <DemoSection title="Geolocation API">
      {geo.loading ? (
        <div className="text-sm text-gray-400 italic">Requesting location...</div>
      ) : geo.error ? (
        <div className="text-sm text-red-500 font-medium">Error: {geo.error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatusBadge label="Latitude" value={geo.latitude} active />
          <StatusBadge label="Longitude" value={geo.longitude} active />
        </div>
      )}
    </DemoSection>
  );
}

export function VibrateDemo() {
  const vibrate = useVibrate();
  return (
    <DemoSection title="Haptic Feedback (Vibrate)">
      <div className="flex gap-3">
        <button onClick={() => vibrate(200)} className="flex-1 py-2 bg-gray-100 border border-gray-200 rounded text-sm hover:bg-gray-200">Short Pulse</button>
        <button onClick={() => vibrate([200, 100, 200])} className="flex-1 py-2 bg-gray-800 text-white rounded text-sm">Pattern Pulse</button>
      </div>
      <p className="text-[10px] text-gray-400 text-center">Requires mobile device support</p>
    </DemoSection>
  );
}

export function FullscreenDemo() {
  const { elementRef, isFullscreen, toggle } = useFullscreen();
  return (
    <DemoSection title="Fullscreen Manager">
      <div 
        ref={elementRef as any} 
        className={`relative flex items-center justify-center rounded-xl transition-all ${isFullscreen ? 'bg-black w-full h-full' : 'bg-indigo-50 h-32 border-2 border-dashed border-indigo-200'}`}
      >
        <button 
          onClick={toggle}
          className={`px-6 py-2 rounded-full font-bold shadow-lg transition-colors ${isFullscreen ? 'bg-white text-black' : 'bg-indigo-600 text-white'}`}
        >
          {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
        </button>
      </div>
    </DemoSection>
  );
}

export function PermissionDemo() {
  const camera = usePermission('camera' as any);
  const notify = usePermission('notifications' as any);
  return (
    <DemoSection title="Permission Tracker">
      <div className="grid grid-cols-2 gap-3">
        <StatusBadge label="Camera" value={camera} active={camera === 'granted'} />
        <StatusBadge label="Notifications" value={notify} active={notify === 'granted'} />
      </div>
    </DemoSection>
  );
}

export function ScriptDemo() {
  const status = useScript('https://code.jquery.com/jquery-3.7.1.min.js');
  return (
    <DemoSection title="Script Loader">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${status === 'ready' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
        <span className="text-sm font-medium">jQuery Status: <code className="bg-gray-100 px-2 rounded uppercase">{status}</code></span>
      </div>
    </DemoSection>
  );
}

export function FaviconDemo() {
  const [icon, setIcon] = useState("https://vitejs.dev/logo.svg");
  useFavicon(icon);
  return (
    <DemoSection title="Dynamic Favicon">
      <div className="flex gap-2">
        <button onClick={() => setIcon("https://react.dev/favicon.ico")} className="px-3 py-1 bg-white border rounded text-xs">React Icon</button>
        <button onClick={() => setIcon("https://vitejs.dev/logo.svg")} className="px-3 py-1 bg-white border rounded text-xs">Vite Icon</button>
      </div>
      <p className="text-[10px] text-gray-400">Watch the browser tab change its icon!</p>
    </DemoSection>
  );
}

export function ObserverDemo() {
  const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
  return (
    <DemoSection title="Intersection Observer">
      <div className="h-24 overflow-y-auto border rounded bg-white p-2">
        <div className="h-40" />
        <div 
          ref={ref as any} 
          className={`p-4 rounded text-center font-bold transition-colors ${entry?.isIntersecting ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}
        >
          {entry?.isIntersecting ? "I AM VISIBLE" : "SCROLL DOWN TO SEE ME"}
        </div>
        <div className="h-40" />
      </div>
    </DemoSection>
  );
}

export default function WebApiDemo() {
  return (
    <div className="space-y-6">
      <ClipboardDemo />
      <NetworkDemo />
      <BatteryDemo />
      <GeolocationDemo />
      <FullscreenDemo />
      <PermissionDemo />
      <ScriptDemo />
      <FaviconDemo />
      <ObserverDemo />
      <VibrateDemo />
    </div>
  );
}
