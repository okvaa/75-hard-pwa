export function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow-md">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}