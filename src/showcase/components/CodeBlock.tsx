import { useBoolean } from "../../hooks/common";

export function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, showCopied, hideCopied] = useBoolean(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      showCopied();
      setTimeout(hideCopied, 2000);
    });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed">
        <code className={`language-${language} text-gray-300`}>{code}</code>
      </pre>
    </div>
  );
}
