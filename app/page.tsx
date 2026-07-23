// import Navbar from "@/components/sections/Navbar";
// import Hero from "@/components/sections/Hero";
// import Stats from "@/components/sections/Stats";
// import About from "@/components/sections/About";
// import Experience from "@/components/sections/Experience";
// import Skills from "@/components/sections/Skills";
// import Projects from "@/Projects";

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-surface">
//       <Navbar />
//       <Hero />
//       <Stats />
//       <About />
//       <Experience />
//       <Skills />
//       <Projects />
//       {/* Remaining sections (Contact) to be added */}
//     </main>
//   );
// }






import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Footer />
    </main>
  );
}
