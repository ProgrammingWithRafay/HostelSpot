import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/figma/ui/button";
import HostelCard from "../components/HostelCard";
import { StarRating } from "../components/figma/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "../components/figma/ui/avatar";
import { useHostels } from "../hooks/useHostels";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { UNIVERSITIES_BY_CITY } from "../utils/constants";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Pick your city",
    desc: "Tell us where you're studying. We'll show you hostels that have been checked by our team, complete with real photos and prices.",
    icon: Search,
  },
  {
    step: "2",
    title: "Pick a place",
    desc: "Look at what fits your budget and read what other students think about it. Then, just request a booking online.",
    icon: Building2,
  },
  {
    step: "3",
    title: "Move in",
    desc: "Once the owner confirms, you just pack your bags and move in when the semester starts.",
    icon: CheckCircle2,
  },
];

const FALLBACK_TESTIMONIALS: any[] = [];

function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value === 0) return;
    
    const node = ref.current;
    if (!node) return;

    let hasRun = false;
    let timer: ReturnType<typeof setInterval>;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun) {
          hasRun = true;
          const duration = 1500;
          const steps = 60;
          const stepTime = Math.max(16, Math.floor(duration / steps));
          let currentStep = 0;

          timer = setInterval(() => {
            currentStep++;
            setCurrent(Math.floor((value / steps) * currentStep));
            if (currentStep >= steps) {
              setCurrent(value);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [value]);

  return <span ref={ref}>{current}</span>;
}

function HeroText() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const full1 = "Find a good";
  const full2 = "student hostel";

  useEffect(() => {
    let i = 0;
    const t1 = setInterval(() => {
      setText1(full1.substring(0, i));
      i++;
      if (i > full1.length) {
        clearInterval(t1);
        let j = 0;
        const t2 = setInterval(() => {
          setText2(full2.substring(0, j));
          j++;
          if (j > full2.length) clearInterval(t2);
        }, 100);
      }
    }, 80);
    return () => clearInterval(t1);
  }, []);

  return (
    <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-5 text-foreground h-[100px] sm:h-[130px]">
      {text1}
      {text1.length < full1.length && <span className="animate-pulse">|</span>}
      {text1.length === full1.length && <br />}
      {text1.length === full1.length && (
        <span className="text-primary">
          {text2}
          {text2.length < full2.length && <span className="animate-pulse">|</span>}
        </span>
      )}
    </h1>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const { hostels, loading: hostelsLoading } = useHostels({ sort: "rating" });
  
  const [stats, setStats] = useState({ hostels: 0, reviews: 0, universities: 0 });
  const [reviews, setReviews] = useState<any[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    async function fetchRealData() {
      if (!isSupabaseConfigured()) {
        setStats({ hostels: 0, reviews: 0, universities: 0 });
        return;
      }
      
      try {
        // Fetch hostels count
        const { count: hCount } = await supabase
          .from('hostels')
          .select('*', { count: 'exact', head: true })
          .eq('verified', true);
          
        // Fetch reviews count
        const { count: rCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });

        // Dynamic universities based on config length, excluding 'Other'
        const allUnivs = Object.values(UNIVERSITIES_BY_CITY).flat().filter(u => u !== 'Other').length;

        setStats({ 
          hostels: hCount || 0, 
          universities: allUnivs || 0,
          reviews: rCount || 0
        });

        // Fetch real reviews
        const { data: realReviews } = await supabase
          .from('reviews')
          .select(`
            rating,
            comment,
            profile:profiles(full_name, university),
            hostel:hostels(name)
          `)
          .eq('rating', 5)
          .not('comment', 'is', null)
          .limit(3);

        if (realReviews && realReviews.length > 0) {
          const mappedReviews = realReviews.map((r: any) => ({
            name: r.profile?.full_name || "Anonymous Student",
            university: r.profile?.university || "Student",
            rating: r.rating,
            text: r.comment,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (r.profile?.full_name || "Anon"),
          }));
          
          setReviews(mappedReviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch real data", err);
        setStats({ hostels: 0, reviews: 0, universities: 0 });
      }
    }
    fetchRealData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hostels?location=${encodeURIComponent(location)}&university=${encodeURIComponent(university)}`);
  };

  const featuredHostels = hostels.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-50 text-slate-900 border-b border-border">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              {stats.hostels > 0 ? (
                <><AnimatedNumber value={stats.hostels} /> Checked Hostels Across Pakistan</>
              ) : (
                "Checked Hostels Across Pakistan"
              )}
            </span>
            
            <HeroText />
            
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              We help you find safe, clean, and affordable hostels near your university without the usual stress.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-2.5 shadow-xl text-left">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <MapPin size={16} className="text-muted-foreground shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 py-2 text-sm bg-transparent outline-none text-foreground"
                  >
                    <option value="">Select City</option>
                    {["Faisalabad", "Lahore", "Islamabad"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block w-px bg-border self-stretch my-1" />
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Building2 size={16} className="text-muted-foreground shrink-0" />
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="flex-1 py-2 text-sm bg-transparent outline-none text-foreground disabled:opacity-50"
                    disabled={!location}
                  >
                    <option value="">{location ? "Select University" : "Select City First"}</option>
                    {location && UNIVERSITIES_BY_CITY[location]?.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="rounded-xl px-6 shrink-0 w-full sm:w-auto">
                  <Search size={16} className="mr-1.5" />Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-card border-b border-border text-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-12 sm:gap-24 text-center">
          {[
            { value: stats.hostels, label: "Checked Hostels" },
            { value: stats.universities, label: "Campuses nearby" },
            { value: stats.reviews, label: "Real student reviews" },
          ]
            .map((s) => (
            <div key={s.label}>
               <p className="text-3xl font-bold text-primary">
                 <AnimatedNumber value={s.value} />
               </p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Hostels ── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-24"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Popular choices</p>
            <h2 className="text-3xl font-bold">Hostels people like</h2>
          </div>
          <button onClick={() => navigate("/hostels")} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer">
            View All <ArrowRight size={15} />
          </button>
        </div>
        
        {hostelsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col h-72 bg-muted rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHostels.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <HostelCard hostel={h} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── How it Works ── */}
      <section className="bg-slate-50 py-24 border-t border-border overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">How to use it</p>
            <h2 className="text-3xl font-bold">How to book a hostel</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-border" />
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative bg-card rounded-2xl p-6 border border-border text-center shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{step}</span>
                <h3 className="font-bold text-lg mt-1 mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">What people say</p>
          <h2 className="text-3xl font-bold">Reviews from students</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <StarRating rating={t.rating} reviews={0} />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{t.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </section>
      )}

      {/* ── Owner CTA ── */}
      <section className="bg-slate-50 border-y border-border text-slate-900 py-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-3">Do you run a hostel?</h2>
            <p className="text-muted-foreground max-w-md">
              Put your hostel on our site to easily find students looking for a place to stay. It doesn't cost anything to join.
            </p>
            <ul className="mt-4 space-y-1.5">
              {["No setup fees", "We check your place", "Handle bookings easily", "Find students fast"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-lg cursor-pointer"
            >
              Add your hostel <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
