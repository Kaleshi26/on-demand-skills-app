// frontend/src/components/Button.jsx
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition';
  const styles = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-white border border-slate-200 hover:bg-slate-50'
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}