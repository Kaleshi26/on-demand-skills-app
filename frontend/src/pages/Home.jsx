import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Find local help fast</h1>
        <p className="mt-3 text-gray-600">Bike repair, guitar tuning, pet grooming and more.</p>
        <div className="mt-6 space-x-3">
          <Link to="/browse" className="px-5 py-3 bg-blue-600 text-white rounded-lg">Browse Services</Link>
          <Link to="/new-service" className="px-5 py-3 bg-gray-900 text-white rounded-lg">Post a Service</Link>
        </div>
      </div>
    </section>
  );
}
