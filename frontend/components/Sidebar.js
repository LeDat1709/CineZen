export default function Sidebar({ position }) {
  return (
    <div className="sticky top-24">
      <div className="glass-effect rounded-2xl p-6 text-center min-h-[600px] flex flex-col items-center justify-center border border-white/20">
        <div className="text-gray-400">
          <div className="text-4xl mb-4">📢</div>
          <p className="font-semibold mb-2">Quảng cáo</p>
          <p className="text-sm">300 x 600</p>
          <p className="text-xs mt-2 opacity-50">({position === 'left' ? 'Trái' : 'Phải'})</p>
        </div>
      </div>
    </div>
  )
}
