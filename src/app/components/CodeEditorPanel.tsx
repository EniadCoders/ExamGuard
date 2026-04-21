import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Language, LANGUAGE_LABELS, LANGUAGE_MONACO } from "../types/exam";
import type { CodeAnswer } from "../types/exam";

const MOCK_OUTPUTS: Record<Language, (code: string) => string> = {
  java: (code) => {
    if (code.includes("System.out.println")) {
      const match = code.match(/System\.out\.println\("([^"]*)"\)/);
      return match ? match[1] + "\n" : "Hello, World!\n";
    }
    return "Compilation réussie.\nAucune sortie.\n";
  },
  python: (code) => {
    if (code.includes("print(")) {
      const match = code.match(/print\("([^"]*)"\)/);
      return match ? match[1] + "\n" : "Hello, World!\n";
    }
    return "Programme exécuté avec succès.\n";
  },
  cpp: () => "Compilation réussie.\nHello, World!\n",
  javascript: (code) => {
    if (code.includes("console.log(")) {
      const match = code.match(/console\.log\("([^"]*)"\)/);
      return match ? match[1] + "\n" : "Hello, World!\n";
    }
    return "undefined\n";
  },
  c: () => "Compilation réussie.\nHello, World!\n",
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

  const currentCode =
    value.code || starterCode || STARTER_CODES[language] || "";

  const handleRun = async () => {
    onChange({ ...value, isRunning: true, hasRun: false, output: "", error: undefined });
    // Simulate compilation + execution delay
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
    <div className="flex flex-col rounded-2xl border border-slate-700/50 overflow-hidden bg-[#0d1117] shadow-2xl">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-700/50 gap-3">
        {/* Left: Language selector */}
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>

          {allowLanguageChange ? (
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/40 text-xs text-slate-300 hover:bg-slate-800 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {LANGUAGE_LABELS[language]}
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange?.(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                        lang === language
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      {lang === language && (
                        <Check className="w-3 h-3 text-cyan-400" />
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {LANGUAGE_LABELS[language]}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copier le code"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handleReset}
            title="Réinitialiser"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-700/60" />
          <button
            onClick={handleRun}
            disabled={value.isRunning || readOnly}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-md shadow-green-500/20"
          >
            {value.isRunning ? (
              <>
                <Square className="w-3.5 h-3.5" />
                En cours…
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Exécuter
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative" style={{ height: "300px" }}>
        {value.isRunning && (
          <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">Compilation en cours…</span>
          </div>
        )}
        <Editor
          height="300px"
          language={LANGUAGE_MONACO[language]}
          value={currentCode}
          onChange={(val) => !readOnly && onChange({ ...value, code: val ?? "" })}
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
            <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>

      {/* Output Panel */}
      <div className="border-t border-slate-700/50 bg-slate-900/60">
        {/* Output tabs */}
        <div className="flex items-center gap-1 px-3 pt-2 border-b border-slate-800/50">
          {(["output", "console"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setOutputTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs transition-all ${
                outputTab === tab
                  ? "text-slate-200 bg-slate-800/60 border border-b-0 border-slate-700/40"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <Terminal className="w-3 h-3" />
              {tab === "output" ? "Sortie" : "Console"}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 pb-1.5">
            {value.hasRun && !value.error && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Succès
              </span>
            )}
            {value.error && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Erreur
              </span>
            )}
          </div>
        </div>

        {/* Output content */}
        <div
          className="p-4 font-mono text-xs leading-relaxed min-h-[80px] max-h-[140px] overflow-y-auto"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {!value.hasRun && !value.isRunning && (
            <p className="text-slate-600 italic">
              Appuyez sur "Exécuter" pour voir la sortie du programme…
            </p>
          )}
          {value.isRunning && (
            <p className="text-slate-500 animate-pulse">Exécution en cours…</p>
          )}
          {value.hasRun && value.error && (
            <pre className="text-red-400 whitespace-pre-wrap">{value.error}</pre>
          )}
          {value.hasRun && !value.error && value.output && (
            <pre className="text-green-300 whitespace-pre-wrap">{value.output}</pre>
          )}
          {value.hasRun && !value.error && !value.output && (
            <p className="text-slate-500 italic">Aucune sortie produite.</p>
          )}
        </div>
      </div>
    </div>
  );
}
