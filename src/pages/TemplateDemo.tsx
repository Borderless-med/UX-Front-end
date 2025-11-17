import MasterTemplate from '@/components/layout/MasterTemplate';

const TemplateDemo = () => {
  return (
    <MasterTemplate
      title="This Is The Universal Header"
      subtitle="Soft blue header, bold blue H1, smaller black subtitle — plus the global sticky-nav offset and the new universal footer."
    >
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl ring-1 ring-slate-200 p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">Demo Card A</h3>
            <p className="text-slate-600">Use this page to preview the shared header/footer and spacing rules before we roll them out to each page.</p>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">Demo Card B</h3>
            <p className="text-slate-600">Nothing functional here changes — this is just visual plumbing to standardize the frame.</p>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">Demo Card C</h3>
            <p className="text-slate-600">After approval, we’ll wrap Compare, Find Clinics, and How It Works with this template.</p>
          </div>
        </div>
      </section>
    </MasterTemplate>
  );
};

export default TemplateDemo;
