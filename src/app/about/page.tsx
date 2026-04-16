import Image from "next/image";

export default function AboutStory() {
  return (
    <main className="pt-32 pb-24 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Editorial Hero */}
      <section className="px-6 md:px-12 mb-32 relative">
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-secondary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 left-10 w-[400px] h-[400px] bg-primary-container opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-8 border border-secondary-container px-4 py-1.5 rounded-full bg-secondary-container/10">Brand Philosophy</span>
          <h1 className="font-['Noto_Serif'] text-6xl md:text-8xl font-bold text-on-surface mb-8 leading-[1.05] tracking-tight">
            Design <br className="hidden md:block" />
            the <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Luminous.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-3xl leading-relaxed">
            Ola is not just a platform; it is a breathable horizon. We are a sanctuary for digital minds who believe that artificial intelligence should augment human warmth, not replace it.
          </p>
        </div>
      </section>

      {/* Origin Story Layout */}
      <section className="px-6 md:px-12 mb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-100 to-teal-50 group-hover:scale-105 transition-transform duration-1000"></div>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJSTZf6QWJ4X93z0-t7f5Wk_VnF9eUquvT54n711_35vJ-Y9J0_v1vB9xIuX-lU9N5JgW9uXlM7p_05e_WbB2A7S6jJgKVuV0QO8Pz7pS9P1A4Jj0R3zT2G5n8sN4m9T7J9H5B1QxS_43K-9b9U5R-1t4S5U3Q2U7L9r9A" 
              alt="Ethereal abstract concept" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Glass decoration */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl">
              <p className="font-['Noto_Serif'] italic text-sky-900 text-lg">"The horizon is not a line, but a space to breathe."</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-['Noto_Serif'] text-4xl md:text-5xl font-bold text-on-surface">The Origin of Ola</h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-light">
              <p>
                In the rapid acceleration of the AI era, the digital landscape became loud, dense, and opaque. The tools designed to save us time instead demanded more of our cognitive load. We built Ola to clear the fog.
              </p>
              <p>
                Starting as a small collective of designers and machine learning engineers, we sought to create a standard for <strong className="text-on-surface font-semibold">breathable interfaces</strong>. Tools that feel lightweight, communities that foster genuine connection, and layouts that give your eyes room to rest.
              </p>
              <p>
                Today, Ola represents a curated ecosystem where aesthetics and neural logic coexist in perfect, atmospheric harmony.
              </p>
            </div>
            
            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-outline-variant/30">
              <div>
                <span className="block text-4xl font-bold text-primary font-['Noto_Serif'] mb-2">2024</span>
                <span className="text-sm font-bold uppercase tracking-wider text-outline">Year Founded</span>
              </div>
              <div>
                <span className="block text-4xl font-bold text-secondary font-['Noto_Serif'] mb-2">12k+</span>
                <span className="text-sm font-bold uppercase tracking-wider text-outline">Collective Minds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Bento */}
      <section className="bg-surface-container-low/50 py-32 mt-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="font-['Noto_Serif'] text-4xl md:text-5xl font-bold text-on-surface mb-6">Our Atmospheric Principles</h2>
            <p className="text-on-surface-variant text-lg font-light">We measure everything we build against these three pillars of the Luminous Horizon.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl text-on-primary-container">air</span>
              </div>
              <h3 className="font-['Noto_Serif'] text-2xl font-bold text-on-surface mb-4">Breathability</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">Negative space is as important as content. We design tools that reduce cognitive friction and allow your mind to wander creatively.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl text-on-secondary-container">diversity_1</span>
              </div>
              <h3 className="font-['Noto_Serif'] text-2xl font-bold text-on-surface mb-4">Symbiosis</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">AI should not replace the artist; it should act as a responsive instrument. We believe in tools that amplify human intent, not automate it away.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-tertiary-container rounded-2xl flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-3xl text-on-tertiary-container">wb_sunny</span>
              </div>
              <h3 className="font-['Noto_Serif'] text-2xl font-bold text-on-surface mb-4">Luminosity</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">Clarity in design, transparency in models. We prioritize open systems and clear aesthetics that bring light to complex architectures.</p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
