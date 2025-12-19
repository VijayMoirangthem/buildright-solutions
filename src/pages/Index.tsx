import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { Services } from '@/components/landing/Services';
import { Projects } from '@/components/landing/Projects';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        {/* <Projects /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
