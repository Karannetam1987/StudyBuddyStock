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
            <div className="flex items-center gap-6 text-sm">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
                </Link>
            </div>
            </div>
        </div>
    </footer>
  );
}
