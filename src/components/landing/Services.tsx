import { Building2, Layers, Hammer, Paintbrush, ClipboardCheck, Home, Icon } from 'lucide-react';
import { services } from '@/data/mockData';

const iconMap: Record<string, typeof Icon> = {
  Building2,
  Layers,
  Hammer,
  Paintbrush,
  ClipboardCheck,
  Home,
};

export function Services() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Construction Solutions
          </h2>
          <p className="text-muted-foreground">
            From foundation to finishing, we provide end-to-end construction services
            tailored to meet your specific needs and exceed your expectations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Building2;
            return (
              <div
                key={service.id}
                className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
