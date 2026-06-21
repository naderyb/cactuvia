import Image from "next/image";
import Preloader from "./components/ui/preloader";
import Navbar from "./components/ui/Navbar";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Boutique from "./components/sections/Boutique";
import Ingredients from "./components/sections/Ingredients";
import Rituels from "./components/sections/Rituels";
import Journal from "./components/sections/Journal";
import Footer from "./components/sections/Footer";

const Separation = () => (
  <div style={{ width: "100%", lineHeight: 0 }}>
    <Image
      src="/seperation.png"
      alt=""
      width={1920}
      height={120}
      style={{
        width: "50%",
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    />
  </div>
);

export default function Home() {
  return (
    <main>
      <Preloader />
      <Navbar />
      <Hero />
      <Separation />
      <Manifesto />
      <Separation />
      <Boutique />
      <Ingredients />
      <Rituels />
      <Separation />
      <Journal />
      <Footer />
    </main>
  );
}
