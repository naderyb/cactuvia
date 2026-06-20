import Navbar from "./components/ui/Navbar";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Boutique from "./components/sections/Boutique";
import Ingredients from "./components/sections/Ingredients";
import Rituels from "./components/sections/Rituels";
import Journal from "./components/sections/Journal";
import Footer from "./components/sections/Footer";

//this is just a test page to render all the sections in one page for development purposes, it will be removed later
export const metadata = {
  title: "CACTUVIA - Soins Naturels · Algérie",
  description:
    "Des cosmétiques naturelles façonnées par la terre. Formules à base de gel de cactus et plantes pour révéler la beauté authentique de chaque femme.",
};
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
