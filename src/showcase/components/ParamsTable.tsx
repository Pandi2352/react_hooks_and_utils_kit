import type { Param } from "../types";

export function ParamsTable({ params, title }: { params: Param[]; title: string }) {
  if (params.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Required</th>
              <th className="px-4 py-3">Default</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {params.map((p) => (
              <tr key={p.name} className="bg-white">
                <td className="px-4 py-3 font-mono text-blue-600 whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 font-mono text-purple-600 text-xs whitespace-nowrap">{p.type}</td>
                <td className="px-4 py-3">{p.required ? <span className="text-yellow-600 font-medium">Yes</span> : <span className="text-gray-400">No</span>}</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">{p.default ?? "—"}</td>
                <td className="px-4 py-3 text-gray-700">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
