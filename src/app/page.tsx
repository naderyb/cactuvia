import Navbar from "./components/ui/Navbar";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Boutique from "./components/sections/Boutique";
import Ingredients from "./components/sections/Ingredients";
import Rituels from "./components/sections/Rituels";
import Journal from "./components/sections/Journal";
import Footer from "./components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Manifesto />
      <Boutique />
      <Ingredients />
      <Rituels />
      <Journal />
      <Footer />
    </main>
  );
}
