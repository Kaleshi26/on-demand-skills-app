// frontend/src/components/SectionHeading.jsx
export default function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`${center ? 'text-center' : ''} space-y-2`}>
      {eyebrow && <p className="text-brand-700 font-semibold">{eyebrow}</p>}
      {title && <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>}
      {subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}