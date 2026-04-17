export const BackgroundLayer = () => {
  return (
    <>
      {/* Base radial gradient */}
      <div className="fixed inset-0 -z-50 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 -z-40 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[900px] w-[1400px] -translate-x-1/2 animate-float rounded-full bg-accent/25 blur-[150px]" />
        <div className="absolute -left-48 top-1/3 h-[600px] w-[800px] animate-float-slow rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute -right-48 bottom-1/4 h-[500px] w-[700px] animate-float rounded-full bg-indigo-600/12 blur-[100px]" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] animate-pulse rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 -z-30 grid-overlay" />

      {/* Noise texture */}
      <div className="noise-texture" />
    </>
  );
};