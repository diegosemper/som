export default function Sterren({ aantal, van = 3 }: { aantal: number; van?: number }) {
  return (
    <span className="sterren">
      {Array.from({ length: van }, (_, i) => (
        <span key={i} className={i < aantal ? '' : 'leeg'}>
          ★
        </span>
      ))}
    </span>
  )
}
