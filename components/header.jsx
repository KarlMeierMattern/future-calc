import { CardHeader, CardTitle } from "@/components/ui/card";

export default function Header() {
  return (
    <CardHeader>
      <CardTitle className="text-3xl font-bold">
        Investment Calculator
      </CardTitle>
      <p className="text-muted-foreground">
        Calculate the future value of your monthly investments.
      </p>
    </CardHeader>
  );
}
