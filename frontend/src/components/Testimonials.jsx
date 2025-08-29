// frontend/src/components/Testimonials.jsx
const items = [
  { name: 'Aisha', quote: 'Found a great Tasker in 5 minutes. Smooth booking, great work!', role: 'Homeowner' },
  { name: 'Leo', quote: 'Booked same-day help to mount my TV. Super fast and friendly.', role: 'Renter' },
  { name: 'Marta', quote: 'As a provider, I get steady bookings and clear messaging.', role: 'Provider' },
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((t, i) => (
        <div key={i} className="card p-6">
          <p className="text-lg leading-relaxed">“{t.quote}”</p>
          <div className="mt-4">
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-slate-500">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}