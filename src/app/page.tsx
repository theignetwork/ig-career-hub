export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-card max-w-2xl w-full p-12 text-center">
        <h1 className="text-5xl font-bold text-teal-gradient mb-4 tracking-tight">
          IG Career Hub
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Your unified job search command center
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">
            Get Started
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
        <div className="mt-12 pt-8 border-t border-border-subtle">
          <p className="text-text-tertiary text-sm">
            Phase 1 Setup Complete - Development Environment Ready
          </p>
        </div>
      </div>
    </main>
  )
}
