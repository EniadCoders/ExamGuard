import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Play,
  RotateCcw,
  Square,
  Terminal,
} from "lucide-react";
import {
  Language,
  LANGUAGE_LABELS,
  LANGUAGE_MONACO,
} from "@/shared/types/exam";
import type { CodeAnswer } from "@/shared/types/exam";

const MOCK_OUTPUTS: Record<Language, (code: string) => string> = {
  java: (code) => {
    if (code.includes("System.out.println")) {
      const match = code.match(/System\.out\.println\("([^"]*)"\)/);
      return match ? `${match[1]}\n` : "Hello, World!\n";
    }
    return "Compilation reussie.\nAucune sortie.\n";
  },
  python: (code) => {
    if (code.includes("print(")) {
      const match = code.match(/print\("([^"]*)"\)/);
      return match ? `${match[1]}\n` : "Hello, World!\n";
    }
    return "Programme execute avec succes.\n";
  },
  cpp: () => "Compilation reussie.\nHello, World!\n",
  javascript: (code) => {
    if (code.includes("console.log(")) {
      const match = code.match(/console\.log\("([^"]*)"\)/);
      return match ? `${match[1]}\n` : "Hello, World!\n";
    }
    return "undefined\n";
  },
  c: () => "Compilation reussie.\nHello, World!\n",
};

const STARTER_CODES: Record<Language, string> = {
  java: `public class Solution {
    public static void main(String[] args) {
        // Votre code ici
        System.out.println("Hello, World!");
    }
}`,
  python: `# Votre code ici
def solve():
    print("Hello, World!")

solve()`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Votre code ici
    cout << "Hello, World!" << endl;
    return 0;
}`,
  javascript: `// Votre code ici
function solve() {
    console.log("Hello, World!");
}

solve();`,
  c: `#include <stdio.h>

int main() {
    // Votre code ici
    printf("Hello, World!\\n");
    return 0;
}`,
};

interface CodeEditorPanelProps {
  language: Language;
  starterCode?: string;
  value: CodeAnswer;
  onChange: (answer: CodeAnswer) => void;
  readOnly?: boolean;
  allowLanguageChange?: boolean;
  onLanguageChange?: (lang: Language) => void;
}

export function CodeEditorPanel({
  language,
  starterCode,
  value,
  onChange,
  readOnly = false,
  allowLanguageChange = false,
  onLanguageChange,
}: CodeEditorPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [outputTab, setOutputTab] = useState<"output" | "console">("output");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCode = value.code || starterCode || STARTER_CODES[language] || "";

  const handleRun = async () => {
    onChange({
      ...value,
      isRunning: true,
      hasRun: false,
      output: "",
      error: undefined,
    });
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const outputFn = MOCK_OUTPUTS[language];
    const simulatedOutput = outputFn(currentCode);
    onChange({
      ...value,
      isRunning: false,
      hasRun: true,
      output: simulatedOutput,
      error: undefined,
    });
  };

  const handleReset = () => {
    onChange({
      code: starterCode || STARTER_CODES[language] || "",
      output: "",
      hasRun: false,
      isRunning: false,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(123,241,255,0.16)] bg-[#07131c] shadow-[0_24px_55px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(123,241,255,0.12)] bg-[rgba(5,14,22,0.94)] px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="mr-2 flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-400/70" />
            <div className="h-3 w-3 rounded-full bg-amber-300/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-300/70" />
          </div>

          {allowLanguageChange ? (
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-[rgba(123,241,255,0.12)] bg-[rgba(11,27,38,0.9)] px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-[rgba(11,27,38,1)]"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {LANGUAGE_LABELS[language]}
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>

              {showLangDropdown && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-xl border border-[rgba(123,241,255,0.14)] bg-[rgba(5,14,22,0.98)] py-1 shadow-xl sm:w-36">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange?.(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                        lang === language
                          ? "bg-cyan-500/10 text-cyan-200"
                          : "text-slate-300 hover:bg-[rgba(11,27,38,0.82)]"
                      }`}
                    >
                      {lang === language && (
                        <Check className="h-3 w-3 text-cyan-200" />
                      )}
                      <span className={lang !== language ? "ml-5" : ""}>
                        {LANGUAGE_LABELS[lang]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(123,241,255,0.12)] bg-[rgba(11,27,38,0.9)] px-3 py-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              {LANGUAGE_LABELS[language]}
            </div>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:justify-start">
          <button
            onClick={handleCopy}
            title="Copier le code"
            className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-[rgba(11,27,38,0.82)] hover:text-slate-200"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reinitialiser"
            className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-[rgba(11,27,38,0.82)] hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700/60" />

          <button
            onClick={handleRun}
            disabled={value.isRunning || readOnly}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-300 px-3 py-1.5 text-xs font-semibold text-[#041117] shadow-md shadow-cyan-500/20 transition-all hover:from-cyan-300 hover:to-sky-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5"
          >
            {value.isRunning ? (
              <>
                <Square className="h-3.5 w-3.5" />
                En cours...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Executer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative h-[240px] sm:h-[300px]">
        {value.isRunning && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-slate-900/60 backdrop-blur-sm">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-2 w-2 animate-bounce rounded-full bg-cyan-300"
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">Compilation en cours...</span>
          </div>
        )}

        <Editor
          height="100%"
          language={LANGUAGE_MONACO[language]}
          value={currentCode}
          onChange={(nextValue) =>
            !readOnly && onChange({ ...value, code: nextValue ?? "" })
          }
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: "gutter",
            readOnly: readOnly || value.isRunning,
            tabSize: 4,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-[#1e1e1e]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-2 w-2 animate-pulse rounded-full bg-slate-600"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>

      <div className="border-t border-[rgba(123,241,255,0.12)] bg-[rgba(5,14,22,0.88)]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[rgba(117,195,214,0.08)] px-3 pt-2">
          {(["output", "console"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setOutputTab(tab)}
              className={`flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-xs transition-all ${
                outputTab === tab
                  ? "border border-b-0 border-[rgba(123,241,255,0.12)] bg-[rgba(11,27,38,0.9)] text-slate-200"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <Terminal className="h-3 w-3" />
              {tab === "output" ? "Sortie" : "Console"}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 pb-1.5">
            {value.hasRun && !value.error && (
              <span className="flex items-center gap-1 text-xs text-cyan-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Succes
              </span>
            )}
            {value.error && (
              <span className="flex items-center gap-1 text-xs text-rose-300">
                <AlertCircle className="h-3.5 w-3.5" />
                Erreur
              </span>
            )}
          </div>
        </div>

        <div
          className="min-h-[72px] max-h-[132px] overflow-y-auto p-3 font-mono text-xs leading-relaxed sm:min-h-[80px] sm:max-h-[140px] sm:p-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {!value.hasRun && !value.isRunning && (
            <p className="italic text-slate-600">
              Appuyez sur "Executer" pour voir la sortie du programme...
            </p>
          )}
          {value.isRunning && (
            <p className="animate-pulse text-slate-500">Execution en cours...</p>
          )}
          {value.hasRun && value.error && (
            <pre className="whitespace-pre-wrap text-rose-300">{value.error}</pre>
          )}
          {value.hasRun && !value.error && value.output && (
            <pre className="whitespace-pre-wrap text-cyan-200">{value.output}</pre>
          )}
          {value.hasRun && !value.error && !value.output && (
            <p className="italic text-slate-500">Aucune sortie produite.</p>
          )}
        </div>
      </div>
    </div>
  );
}
