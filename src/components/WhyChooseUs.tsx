/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Landmark, Zap, Clock, TrendingUp, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';
import SectionBackground3D from './SectionBackground3D.tsx';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

export default function WhyChooseUs() {
  const features: FeatureItem[] = [
    {
      id: 'products',
      title: 'Premium Quality Products',
      description: 'We prioritize Tier-1 micro-silicon hardware with 25-Year peak performance guarantees.',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'engineers',
      title: 'Certified Engineers',
      description: 'In-house design and deployment managed strictly by licensed master electricians and civil leads.',
      icon: <CheckSquare className="w-5 h-5 text-indigo-400" />,
      accent: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'subsidy',
      title: 'Government Subsidy Support',
      description: 'Hassle-free application submission under regional net-metering schemes and state quotas.',
      icon: <Landmark className="w-5 h-5 text-[#FFC107]" />,
      accent: 'border-amber-500/20 text-amber-400 bg-amber-500/10'
    },
    {
      id: 'installation',
      title: 'Precision Fast Installation',
      description: 'Rapid structural deployment within 72 hours of regulatory civil approvals.',
      icon: <Zap className="w-5 h-5 text-sky-400" />,
      accent: 'border-sky-500/20 text-sky-400 bg-sky-500/10'
    },
    {
      id: 'support',
      title: 'Lifetime Expert Support',
      description: '24/7 prioritized operational response with on-demand service dispatches.',
      icon: <Clock className="w-5 h-5 text-rose-500" />,
      accent: 'border-rose-500/20 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'monitoring',
      title: 'Performance Monitoring',
      description: 'Continuous cloud-linked performance tracking dashboard with predictive maintenance alerts.',
      icon: <TrendingUp className="w-5 h-5 text-lime-400" />,
      accent: 'border-lime-500/20 text-lime-400 bg-lime-500/10'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="timeline" className="relative py-12 md:py-28 bg-[#041120] overflow-hidden border-b border-white/5">
      {/* Interactive 3D Concentric Solar Tech Orbits Background */}
      <SectionBackground3D type="whychoose" />

      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 md:mb-20 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/20 text-xs font-bold tracking-widest text-[#FFC107] uppercase rounded-full">
            <Award className="w-3.5 h-3.5" />
            Uncompromised Corporate Standards
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Why Partner with <span className="bg-gradient-to-r from-emerald-400 to-[#FFC107] bg-clip-text text-transparent">Ashonika?</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            We deliver state-of-the-art clean energy solutions backed by rigorous certified safety engineering.
          </p>
        </motion.div>

        {/* Clean, compact responsive Grid Layout with Stagger Animation - Two column on mobile */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -8, borderColor: 'rgba(74, 222, 128, 0.3)', transition: { duration: 0.2 } }}
              className="group p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-[#09223c]/60 backdrop-blur-md border border-white/10 hover:shadow-2xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col sm:flex-row gap-3 sm:gap-5 items-start h-full"
            >
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 ${feature.accent}`}>
                {React.cloneElement(feature.icon as React.ReactElement, { className: 'w-4 h-4 sm:w-6 sm:h-6' })}
              </div>
              <div className="space-y-1 sm:space-y-1.5 flex-1 w-full">
                <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono block">
                  0{index + 1} / Feature
                </span>
                <h3 className="text-[11px] sm:text-base font-bold text-white tracking-tight group-hover:text-[#FFC107] transition-colors leading-snug">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
