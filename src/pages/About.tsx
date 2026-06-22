import { Target, Heart, Shield, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/figma/ui/avatar";
import { Separator } from "../components/figma/ui/separator";

const TEAM = [
  { name: "Rafay", title: "Founder & FAST University Student", image: "/founder.jpg" },
];

const VALUES = [
  { icon: Shield, title: "Trust & Safety", desc: "Every hostel on HostelSpot is site-visited and verified by our team. We never list a property we haven't personally checked." },
  { icon: Heart, title: "Student First", desc: "We built HostelSpot as students who struggled to find accommodation. Every decision we make starts with what's best for the student." },
  { icon: Target, title: "Transparency", desc: "Real photos, real pricing, real reviews. No hidden costs, no misleading listings, no surprises when you arrive." },
  { icon: Zap, title: "Fast & Reliable", desc: "From search to booking confirmation in under 5 minutes. Our platform is optimized for the speed that students need." },
];

export default function About() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Our Story</p>
          <h1 className="text-4xl font-bold mb-5">We Make Student Housing Simple</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            HostelSpot was founded in 2026 by a final year student at FAST University. After seeing many friends who were hostelites struggle to find safe and affordable accommodation, I built the platform they wished had existed: verified listings, honest reviews, and a transparent booking process.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Mission</p>
            <h2 className="text-3xl font-bold mb-4">Connecting Students to Safe Homes</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pakistan has over 2 million students enrolled in universities across the country. The majority relocate to a new city for their studies, and almost all of them rely on word-of-mouth or WhatsApp groups to find accommodation. We&apos;re changing that.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              HostelSpot brings the entire hostel-finding experience online, from discovery to booking, with the transparency and trust that students deserve. We verify every listing, surface authentic reviews, and connect students directly with vetted hostel owners.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden bg-muted">
            <img
              src="/about_students.png"
              alt="Students in a common room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">What We Stand For</p>
          <h2 className="text-3xl font-bold">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The People</p>
          <h2 className="text-3xl font-bold">Meet The Founder</h2>
        </div>
        <div className="flex justify-center">
          {TEAM.map(({ name, title, image }) => (
            <div key={name} className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/10 shadow-lg">
                <AvatarImage src={image} />
                <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
