import { Target, Users, Award, Shield } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Target, value: '150+', label: 'Projects Completed' },
    { icon: Users, value: '100+', label: 'Happy Clients' },
    { icon: Award, value: '20+', label: 'Years Experience' },
    { icon: Shield, value: '100%', label: 'Quality Assured' },
  ];

  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              About Us
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Building Excellence Since 2004
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              Ningthoujam Constructions has been a cornerstone of quality construction
              in Manipur for over two decades. Founded with a vision to transform the
              construction landscape in the region, we have successfully delivered
              residential, commercial, and industrial projects that stand as testaments
              to our commitment to excellence.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Our team of skilled professionals brings together traditional craftsmanship
              and modern construction techniques. We believe in building not just
              structures, but lasting relationships with our clients through transparency,
              reliability, and unwavering dedication to quality.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Quality First</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Client Focused</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">On-Time Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Expert Team</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-background rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
