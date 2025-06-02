
import React from 'react';

const Stats = () => {
  const stats = [
    { number: '500+', label: 'Ideas Submitted' },
    { number: '150+', label: 'Active Executors' },
    { number: '$2M+', label: 'Raised by Partners' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
