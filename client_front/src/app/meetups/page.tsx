import Image from "next/image";

async function getUpcomingMeetups() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/meetups/upcoming`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch meetups:", error);
    return [];
  }
}

export default async function Meetups() {
  const meetups = await getUpcomingMeetups();
  const featuredMeetup = meetups[0];
  const otherMeetups = meetups.slice(1);

  return (
    <main className="pt-32 pb-24 max-w-[1920px] mx-auto min-h-screen">
      
      {/* Header */}
      <header className="px-6 md:px-12 mb-20 text-center max-w-4xl mx-auto space-y-6">
        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">groups</span>
        <h1 className="font-['Noto_Serif'] text-5xl md:text-7xl font-bold text-on-surface leading-[1.1] tracking-tight">
          Synchronize <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Minds.</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed">
          Join live seminars, asynchronous design sprints, and atmospheric hacking sessions with the Ola community.
        </p>
      </header>

      {/* Featured Upcoming Meetup */}
      {featuredMeetup && (
        <section className="px-6 md:px-12 mb-32">
          <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-surface-container-low to-white shadow-[0_30px_60px_-15px_rgba(0,101,141,0.1)] p-8 md:p-14 relative overflow-hidden border border-white">
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-container-low z-10"></div>
              <img 
                src={featuredMeetup.coverUrl || "https://images.unsplash.com/photo-1540575861501-7ce0e1d1aa6f?auto=format&fit=crop&w=1200&q=80"} 
                alt={featuredMeetup.title} 
                className="w-full h-full object-cover mix-blend-multiply opacity-50"
              />
            </div>
            
            <div className="relative z-20 max-w-2xl text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-error text-on-error font-bold text-xs uppercase tracking-widest mb-8 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span> Live This Week
              </span>
              <h2 className="font-['Noto_Serif'] text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
                {featuredMeetup.title}
              </h2>
              <div className="flex flex-wrap items-center gap-6 mb-10 text-on-surface-variant text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  {new Date(featuredMeetup.date).toLocaleDateString()} • {new Date(featuredMeetup.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  {featuredMeetup.location}
                </div>
              </div>
              <p className="text-on-surface-variant text-lg mb-12 leading-relaxed">
                {featuredMeetup.description}
              </p>
              <div className="flex items-center gap-6 text-sm">
                 <div className="flex -space-x-3">
                   <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Attendee" />
                   <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Attendee" />
                   <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Attendee" />
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">+{featuredMeetup._count?.attendees || 0}</div>
                 </div>
                 <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                   Reserve Seat
                 </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Upcoming */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant/30 pb-6">
          <h2 className="font-['Noto_Serif'] text-3xl font-bold text-on-surface">Upcoming Tides</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {otherMeetups.map((meetup: any) => (
            <div key={meetup.id} className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,101,141,0.08)] transition-all hover:-translate-y-1">
               <div className="flex justify-between items-start mb-8">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold font-['Noto_Serif']">
                   {new Date(meetup.date).getDate()}
                 </div>
                 <span className="text-xs uppercase font-bold text-outline tracking-wider">
                   {new Date(meetup.date).toLocaleString('en-US', { month: 'short' })}
                 </span>
               </div>
               <h3 className="font-['Noto_Serif'] text-2xl font-bold mb-3 text-on-surface">{meetup.title}</h3>
               <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">{meetup.description}</p>
               <button className="w-full py-3 rounded-full border border-primary/30 text-primary font-bold hover:bg-primary hover:text-white transition-colors text-sm">Join Waitlist</button>
            </div>
          ))}
          
          <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-inner border border-outline-variant/10">
             <span className="material-symbols-outlined text-4xl text-outline mb-4">edit_calendar</span>
             <h3 className="font-['Noto_Serif'] text-xl font-bold mb-2 text-on-surface">Suggest a Topic</h3>
             <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Have a technique you want to share with the community?</p>
             <button className="text-primary font-bold hover:underline underline-offset-4 text-sm">Submit Proposal</button>
          </div>
          
        </div>
      </section>

    </main>
  );
}
