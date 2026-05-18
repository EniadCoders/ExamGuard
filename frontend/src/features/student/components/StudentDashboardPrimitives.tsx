/**
 * Petits composants UI partagés par les vues du dashboard étudiant :
 * pastille de type de question (`ExamTypeChip`) et anneau de score animé
 * (`ScoreRing`) réutilisés par ExamsList, ResultsList et ResultDetailModal.
 */
import { DashboardTag } from "@/shared/components/dashboard/DashboardCard";

interface ExamTypeChipProps {
  questionType?: string;
  type?: string;
}

const questionTypeMap: Record<string, { label: string }> = {
  mcq: { label: "QCM" },
  text: { label: "Texte" },
  code: { label: "Code" },
};

export function ExamTypeChip({ questionType, type }: ExamTypeChipProps) {
  const resolvedType = questionType ?? type ?? "mcq";
  const config = questionTypeMap[resolvedType] ?? questionTypeMap.mcq;

  return <DashboardTag>{config.label}</DashboardTag>;
}

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  variant?: "percentage" | "out-of-20";
}

const scoreRingSizes = {
  sm: { width: 60, stroke: 4, fontSize: "text-sm" },
  md: { width: 80, stroke: 5, fontSize: "text-lg" },
  lg: { width: 100, stroke: 6, fontSize: "text-2xl" },
} as const;

export function ScoreRing({ score, size = "md", variant = "out-of-20" }: ScoreRingProps) {
  const config = scoreRingSizes[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, score / 20));
  const offset = circumference - ratio * circumference;

  const scoreOutOf20 = parseFloat(score.toFixed(1));
  const percentage = Math.round(ratio * 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: config.width, height: config.width }}
    >
      <svg className="transform -rotate-90" width={config.width} height={config.width}>
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          stroke="rgba(117, 195, 214, 0.16)"
          strokeWidth={config.stroke}
          fill="none"
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          stroke="#8BF3FF"
          strokeWidth={config.stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {variant === "out-of-20" ? (
          <span className={`font-bold text-black flex items-baseline gap-0.5 ${
            size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-xs"
          }`}>
            {scoreOutOf20}
            <span className="text-[0.65em] font-medium text-[#666666]">/20</span>
          </span>
        ) : (
          <span className={`font-bold text-black ${config.fontSize}`}>{percentage}%</span>
        )}
      </div>
    </div>
  );
}
