export default function ResultsSkeleton() {
  const S = ({ h = 20, w = '100%', r = 8 }) => (
    <div className="skeleton" style={{ height: h, width: w, borderRadius: r }} />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score hero */}
      <div style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '2rem' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <S h={180} w={180} r={999} />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[...Array(6)].map((_, i) => <S key={i} h={50} r={10} />)}
          </div>
        </div>
      </div>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#111114', border: '1px solid #242428', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><S h={14} w={80} /><S h={14} w={30} /></div>
            <S h={3} />
            <S h={40} />
          </div>
        ))}
      </div>
      {/* Hook */}
      <div style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><S h={20} w={160} /><S h={20} w={80} /></div>
        <S h={3} />
        <S h={14} /><S h={14} w="70%" />
        {[...Array(3)].map((_, i) => <S key={i} h={52} r={12} />)}
      </div>
      {/* Caption + Hashtags */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[0, 1].map(i => (
          <div key={i} style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <S h={20} w={140} /><S h={80} /><S h={14} /><S h={14} w="60%" />
          </div>
        ))}
      </div>
      {/* Competitor */}
      <div style={{ background: '#111114', border: '1px solid #242428', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <S h={20} w={200} />
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <S h={14} w={120} /><S h={26} r={999} />
          </div>
        ))}
      </div>
    </div>
  )
}
