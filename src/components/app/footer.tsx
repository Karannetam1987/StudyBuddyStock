import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card mt-auto">
        <Separator />
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Investo Future Consultancy. All rights reserved.
            </p>
            </div>
        </div>
    </footer>
  );
}
