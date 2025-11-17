import React, { useState } from 'react';

const PrototypeHub: React.FC = () => {
  const [sel, setSel] = useState<'all' | 'jb' | 'sg'>('all');

  const homeUrl = '/home-prototype-v2';
  const clinicsUrl = `/find-clinics-prototype1?sel=${sel}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Prototypes Hub</h1>
        <p className="text-slate-600 mb-6">Single URL to view both prototypes together. Use the selector to change the Find Clinics view.</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-700">Find Clinics selection:</span>
          <div className="inline-flex rounded-lg overflow-hidden ring-1 ring-slate-200">
            <button onClick={() => setSel('all')} className={`px-3 py-1 text-sm ${sel==='all'?'bg-white text-slate-900':'bg-slate-100 text-slate-700'}`}>All</button>
            <button onClick={() => setSel('jb')} className={`px-3 py-1 text-sm ${sel==='jb'?'bg-emerald-100 text-emerald-900':'bg-slate-100 text-slate-700'}`}>JB</button>
            <button onClick={() => setSel('sg')} className={`px-3 py-1 text-sm ${sel==='sg'?'bg-blue-100 text-blue-900':'bg-slate-100 text-slate-700'}`}>SG</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between text-sm">
              <span className="font-semibold">Home Prototype v2</span>
              <a className="text-blue-600 hover:underline" href={homeUrl} target="_blank" rel="noreferrer">Open in new tab</a>
            </div>
            <iframe title="home-prototype-v2" src={homeUrl} className="w-full h-[80vh]" />
          </div>

          <div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between text-sm">
              <span className="font-semibold">Find Clinics Prototype</span>
              <a className="text-blue-600 hover:underline" href={clinicsUrl} target="_blank" rel="noreferrer">Open in new tab</a>
            </div>
            <iframe title="find-clinics-prototype1" src={clinicsUrl} className="w-full h-[80vh] bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeHub;
