import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/10 bg-ivory-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-medium text-gold">DADA</h3>
            <p className="text-charcoal/70 text-sm">
              Kontrollü kaos ve disiplinle buluşan sanat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-charcoal">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>
                <Link href="/courses" className="hover:text-gold transition-beat">
                  Kurslar
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:text-gold transition-beat">
                  Akademi
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-beat">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-charcoal">İletişim</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>info@dadasanatakademisi.com</li>
              <li>+90 (XXX) XXX XX XX</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-charcoal">Sosyal Medya</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>
                <Link href="#" className="hover:text-gold transition-beat">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-beat">
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-charcoal/10 text-center text-sm text-charcoal/60">
          <p>&copy; {currentYear} Dada Sanat Akademisi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

