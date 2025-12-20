import { useAuth } from '../context/AuthContext';
import {
  HeroSection,
  HowItWorks,
  KeyFeatures,
  SampleItinerary,
  WhyChooseUs,
  FAQ,
  FinalCTA,
} from '../components/home';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full viewport height with animated gradient */}
      <HeroSection isLoggedIn={!!user} />

      {/* How It Works - 3 step process */}
      <HowItWorks />

      {/* Key Features - Feature cards grid */}
      <KeyFeatures />

      {/* Sample Itinerary Preview - Interactive timeline demo */}
      <SampleItinerary />

      {/* Why Choose Us - Benefits and stats */}
      <WhyChooseUs />

      {/* Final CTA - Strong call to action */}
      <FinalCTA isLoggedIn={!!user} />

      {/* FAQ Section - Before footer */}
      <FAQ />
    </div>
  );
}
