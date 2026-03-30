import { Link } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}