import { useState } from "react";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "../components/figma/ui/button";
import { Input } from "../components/figma/ui/input";
import { Label } from "../components/figma/ui/label";
import { Textarea } from "../components/figma/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/figma/ui/select";
import { Alert, AlertDescription } from "../components/figma/ui/alert";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "rafayalishah74@gmail.com", sub: "We reply within 24 hours" },
  { icon: Phone, label: "Phone", value: "+92 3287675530", sub: "Available 24/7" },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-muted-foreground">Have a question, suggestion, or need help finding a hostel? We&apos;re here for you.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-[1fr_380px] gap-12">
          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>

            {submitted ? (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  Thanks for reaching out, {form.name}! We&apos;ll get back to you at {form.email} within 24 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Ahmad Raza" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={form.subject} onValueChange={(val) => setForm({ ...form, subject: val })}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Help</SelectItem>
                      <SelectItem value="listing">List My Hostel</SelectItem>
                      <SelectItem value="report">Report an Issue</SelectItem>
                      <SelectItem value="general">General Enquiry</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full rounded-xl py-5">Send Message</Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Other Ways to Reach Us</h2>
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-primary text-primary-foreground rounded-2xl p-5 mt-2 shadow-lg">
              <p className="font-bold mb-1">For Hostel Owners</p>
              <p className="text-sm text-primary-foreground/80">Want to list your property? I will personally guide you through the verification process. Reach out using the contact details above!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
