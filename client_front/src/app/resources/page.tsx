import Image from "next/image";

async function getResources() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/resources`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return [];
  }
}

async function getFeaturedResources() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/resources/featured`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch featured resources:", error);
    return [];
  }
}

export default async function Resources() {
  const [resources, featuredResources] = await Promise.all([
    getResources(),
    getFeaturedResources(),
  ]);
  return (
    <main className="pt-32 pb-24 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Search Header */}
      <section className="px-6 md:px-12 mb-20 text-center max-w-4xl mx-auto space-y-8">
        <div>
          <span className="material-symbols-outlined text-4xl text-primary mb-4 opacity-80">library_books</span>
          <h1 className="font-['Noto_Serif'] text-5xl md:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight mb-4">
            The Learning <span className="italic font-normal text-primary">Archive.</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-light">Community-driven knowledge bases and prompt decks.</p>
        </div>
        
        <div className="relative group max-w-2xl mx-auto shadow-sm">
          <input 
            type="text" 
            className="w-full bg-white border border-outline-variant/30 rounded-2xl py-5 pl-14 pr-6 text-on-surface focus:ring-primary focus:ring-2 focus:border-transparent transition-all outline-none" 
            placeholder="Search guides, prompt templates, tool docs..." 
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-[24px]">
            search
          </span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-bold font-mono">⌘ K</div>
        </div>
      </section>

      {/* Featured Resources Horizontal Scroll */}
      <section className="pl-6 md:pl-12 mb-24 overflow-hidden relative">
        <div className="flex gap-6 overflow-x-auto pb-8 pr-6 md:pr-12 no-scrollbar snap-x snap-mandatory">
          
          {featuredResources.map((resource: any, idx: number) => (
            <div key={resource.id} className={`min-w-[85vw] md:min-w-[600px] snap-center rounded-[2rem] ${idx % 2 === 0 ? 'bg-sky-900 text-white' : 'bg-gradient-to-br from-surface-container-low to-white text-on-surface'} p-8 md:p-12 border border-outline-variant/20 shadow-lg relative overflow-hidden group`}>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
              <span className={`inline-block px-3 py-1 rounded-full ${idx % 2 === 0 ? 'bg-white/10 text-white' : 'bg-primary-container text-on-primary-container'} font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/20`}>
                {resource.type}
              </span>
              <h2 className="font-['Noto_Serif'] text-3xl md:text-4xl font-bold mb-4">{resource.title}</h2>
              <p className={`${idx % 2 === 0 ? 'text-white/80' : 'text-on-surface-variant'} leading-relaxed mb-10 max-w-md font-light text-sm md:text-base`}>
                {resource.description}
              </p>
              <div className="flex justify-between items-end mt-auto">
                <div className="flex -space-x-2">
                  <img src={`https://i.pravatar.cc/100?img=${idx + 10}`} className="w-8 h-8 rounded-full border-2 border-sky-900" alt="Author" />
                  <p className="text-xs font-bold ml-4 uppercase tracking-widest self-center opacity-70">By {resource.author?.name || 'Curator'}</p>
                </div>
                <button className={`flex items-center gap-2 font-bold ${idx % 2 === 0 ? 'text-secondary-fixed hover:text-white' : 'text-primary'} transition-colors group`}>
                  View Resource <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </button>
              </div>
            </div>
          ))}

          {featuredResources.length === 0 && (
            <div className="min-w-full py-20 text-center text-on-surface-variant opacity-50 font-['Noto_Serif']">
              Generating new insights for the archive...
            </div>
          )}
          
        </div>
      </section>

      {/* Categorized Archive */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1 border-r border-outline-variant/20 pr-6 space-y-8 hidden md:block">
            <h3 className="font-bold text-on-outline uppercase tracking-widest text-xs mb-4 border-b border-outline-variant/20 pb-4">Categories</h3>
            <ul className="space-y-4 font-medium text-on-surface-variant text-sm">
              <li className="text-primary font-bold cursor-pointer hover:translate-x-1 transition-transform inline-block">All Resources</li><br/>
              <li className="cursor-pointer hover:text-primary hover:translate-x-1 transition-transform inline-block">Prompt Decks</li><br/>
              <li className="cursor-pointer hover:text-primary hover:translate-x-1 transition-transform inline-block">Workflow Scripts</li><br/>
              <li className="cursor-pointer hover:text-primary hover:translate-x-1 transition-transform inline-block">Model Fine-tuning</li><br/>
              <li className="cursor-pointer hover:text-primary hover:translate-x-1 transition-transform inline-block">Case Studies</li><br/>
              <li className="cursor-pointer hover:text-primary hover:translate-x-1 transition-transform inline-block">Community Essays</li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <div className="grid sm:grid-cols-2 gap-6">
              
              {resources.map((resource: any) => (
                <div key={resource.id} className="group rounded-2xl border border-outline-variant/30 hover:border-primary/50 bg-white p-6 transition-all hover:shadow-md cursor-pointer flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-surface-container px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {resource.type === 'Script' ? 'terminal' : resource.type === 'Essay' ? 'chrome_reader_mode' : 'view_carousel'}
                      </span> 
                      {resource.type}
                    </div>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary">bookmark_add</span>
                  </div>
                  <h4 className="font-['Noto_Serif'] text-xl font-bold mb-2">{resource.title}</h4>
                  <p className="text-sm text-on-surface-variant font-light mb-8 flex-grow">{resource.description}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                    <span className="text-xs font-semibold text-on-surface-variant">{(resource.reads / 1000).toFixed(1)}k reads</span>
                    <span className="ml-auto text-[10px] items-center px-2 py-0.5 rounded-full bg-surface-container-low font-bold uppercase tracking-tighter">{resource.difficulty}</span>
                  </div>
                </div>
              ))}
              
              <div className="group rounded-2xl border border-outline-variant/30 hover:border-secondary/50 bg-white p-6 transition-all hover:shadow-md cursor-pointer flex flex-col h-full border-b-4 border-b-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-surface-container px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">school</span> Beginner
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary">bookmark_add</span>
                </div>
                <h4 className="font-['Noto_Serif'] text-xl font-bold mb-2">Zero to Luminous</h4>
                <p className="text-sm text-on-surface-variant font-light mb-8 flex-grow">The official Ola starting point. Get your AI workstation set up in under an hour.</p>
                <div className="flex items-center pt-4 border-t border-outline-variant/10">
                  <button className="text-xs font-bold text-secondary uppercase tracking-wider border border-secondary px-4 py-1.5 rounded-full w-full hover:bg-secondary hover:text-white transition-colors group-hover:bg-secondary group-hover:text-white">Start Path</button>
                </div>
              </div>

            </div>
            
            <div className="mt-12 text-center">
              <button className="px-8 py-3 rounded-full border border-outline-variant/50 text-on-surface-variant font-semibold hover:border-primary hover:text-primary transition-colors text-sm shadow-sm bg-white">
                Load More Resources
              </button>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
