export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Fine grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(50, 130, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(50, 130, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Larger grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(187, 225, 250, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 225, 250, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Base gradient - ExamGuard blue style */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B262C]/30 via-transparent to-[#0F4C75]/40" />

      {/* Ambient glow blobs */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#3282B8]/10 rounded-full blur-[120px] animate-pulse-soft" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-[#BBE1FA]/8 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-[#0F4C75]/6 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#1B262C]/50" />
    </div>
  );
}