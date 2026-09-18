import Header from "@/components/header";
import Footer from "@/components/footer";
import CalculatorClient from "@/components/calculator-client";

export default function Home() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-6 print:max-w-none print:px-0 print:pb-0">
      <Header />
      <CalculatorClient />
      <Footer />
    </main>
  );
}
