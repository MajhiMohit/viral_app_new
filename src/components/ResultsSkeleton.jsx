export default function ResultsSkeleton() {
  const Block = ({ h = 'h-4', w = 'w-full', className = '' }) => (
    <div className={`skeleton ${h} ${w} ${className}`} />
  )
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-8" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-44 h-44 rounded-full skeleton shrink-0" />
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <Block key={i} h="h-14" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between"><Block h="h-4" w="w-24" /><Block h="h-4" w="w-8" /></div>
            <Block h="h-1.5" />
            <Block h="h-12" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between"><Block h="h-6" w="w-40" /><Block h="h-6" w="w-24" /></div>
        <Block h="h-1" />
        <Block h="h-4" />
        <Block h="h-4" w="w-3/4" />
        {[...Array(3)].map((_, i) => <Block key={i} h="h-14" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map(i => (
          <div key={i} className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <Block h="h-6" w="w-40" />
            <Block h="h-24" />
            <Block h="h-4" />
            <Block h="h-4" w="w-2/3" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <Block h="h-6" w="w-48" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Block h="h-4" w="w-32" />
            <Block h="h-7" className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
