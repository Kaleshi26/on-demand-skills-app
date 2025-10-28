// frontend/src/pages/Tasks.jsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import api from '../lib/api';
import TaskCard from '../components/TaskCard';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Furniture Assembly',
  'Moving Help',
  'Mounting & Installation',
  'Cleaning',
  'Yardwork',
  'Handyman',
  'Delivery',
  'Pet Care',
  'Photography',
  'Tutoring'
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Tasks() {
  const q = useQuery();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState(q.get('q') || '');
  const [category, setCategory] = useState(q.get('category') || '');
  const [min, setMin] = useState(q.get('min') || '');
  const [max, setMax] = useState(q.get('max') || '');
  const [status, setStatus] = useState(q.get('status') || 'open');
  const [sort, setSort] = useState('recent');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  function pushUrl() {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (category) p.set('category', category);
    if (min) p.set('min', min);
    if (max) p.set('max', max);
    if (status) p.set('status', status);
    navigate(`/tasks?${p.toString()}`, { replace: true });
  }

  async function fetchTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (min) params.set('min', min);
      if (max) params.set('max', max);
      if (status) params.set('status', status);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      let arr = data;
      
      if (sort === 'price-asc') arr = [...arr].sort((a, b) => a.budget - b.budget);
      if (sort === 'price-desc') arr = [...arr].sort((a, b) => b.budget - a.budget);
      if (sort === 'recent') arr = [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTasks(arr);
    } catch (error) {
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [sort]); // eslint-disable-line

  const handleSearch = () => {
    pushUrl();
    fetchTasks();
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setMin('');
    setMax('');
    setStatus('open');
    setSort('recent');
    navigate('/tasks');
    fetchTasks();
  };

  return (
    <div className="container-max py-10">
      <div className="flex items-center justify-between mb-8">
        <SectionHeading 
          title="Task Board" 
          subtitle="Find tasks that match your skills and availability."
        />
        {user && (
          <Button onClick={() => navigate('/tasks/new')}>
            <FaPlus className="w-4 h-4 mr-2" />
            Post a Task
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="card p-4 space-y-4 h-fit">
          <div>
            <label className="text-sm text-slate-600">Search</label>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="e.g., 'mount tv'" 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" 
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c === category ? '' : c)}
                  className={`badge ${c === category ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-slate-600">Min $</label>
              <input 
                value={min} 
                onChange={e => setMin(e.target.value)} 
                type="number" 
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Max $</label>
              <input 
                value={max} 
                onChange={e => setMax(e.target.value)} 
                type="number" 
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600">Sort</label>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="recent">Most recent</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">Apply</Button>
            <button 
              className="btn-ghost flex-1" 
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </aside>

        {/* Results */}
        <section className="md:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse" />
              ))}
            </div>
          ) : tasks.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tasks found"
              description="Try adjusting your filters or check back later for new tasks."
              actionLabel="Post a Task"
              onAction={() => navigate('/tasks/new')}
            />
          )}
        </section>
      </div>
    </div>
  );
}
