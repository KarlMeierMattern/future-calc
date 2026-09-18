import Header from "@/components/header";
import Footer from "@/components/footer";
import CalculatorClient from "@/components/calculator-client";

export default function Home() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto p-4 space-y-6">
      <Header />
      <CalculatorClient />
      <Footer />
    </main>
  );
}
