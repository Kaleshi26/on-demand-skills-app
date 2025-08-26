import { Link } from 'react-router-dom';

export default function ServiceCard({ s }) {
  return (
    <Link to={`/services/${s._id}`} className="block rounded-xl border bg-white p-4 shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{s.title}</h3>
        <span className="text-blue-600 font-bold">${s.price}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{s.description}</p>
      <p className="text-xs text-gray-500 mt-2">{s.category} • by {s.owner?.name}</p>
    </Link>
  );
}
