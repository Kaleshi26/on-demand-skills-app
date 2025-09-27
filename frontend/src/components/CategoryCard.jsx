// frontend/src/components/CategoryCard.jsx
import { Link } from 'react-router-dom';

export default function CategoryCard({ name, image }) {
  return (
    <Link to={`/browse?category=${encodeURIComponent(name)}`} className="block card overflow-hidden hover:shadow-lg transition">
      <img src={image} alt={name} className="h-36 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-slate-600">Find trusted help for {name.toLowerCase()}.</p>
      </div>
    </Link>
  );
}