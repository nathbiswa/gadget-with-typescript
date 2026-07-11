
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 text-sm border-t border-slate-800 pt-12 pb-6 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        <div>
          <Link href="/" className="text-2xl font-bold text-white mb-4 block">
            Gadget<span className="text-indigo-500">Lease</span>
          </Link>
          <p className="text-gray-400 leading-relaxed text-xs mb-4">
            Bangladesh's premium tech rental marketplace. Rent top-tier production and gaming gear with ultimate peace of mind.
          </p>
          
          <div className="flex space-x-4">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.81.058a5.18 5.18 0 011.751.325 3.12 3.12 0 011.832 1.832c.195.497.302 1.056.325 1.751.048 1.026.058 1.38.058 3.81s-.01 2.784-.058 3.81a5.18 5.18 0 01-.325 1.751 3.12 3.12 0 01-1.832 1.832c-.497.195-1.056.302-1.751.325-1.026.048-1.38.058-3.81.058s-2.784-.01-3.81-.058a5.18 5.18 0 01-1.751-.325 3.12 3.12 0 01-1.832-1.832c-.195-.497-.302-1.056-.325-1.751C2.01 14.84 2 14.486 2 12s.01-2.784.058-3.81a5.18 5.18 0 01.325-1.751 3.12 3.12 0 011.832-1.832c.497-.195 1.056-.302 1.751-.325 1.026-.048 1.38-.058 3.81-.058zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.35-8.65a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link href="/explore" className="hover:text-white transition-colors">Explore All Gear</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Tech Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Legal & Help</h4>
          <ul className="space-y-2">
            <li><Link href="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact Us</h4>
          <p className="text-xs text-gray-400 mb-2">📍 Hub Location: Banani, Dhaka, Bangladesh</p>
          <p className="text-xs text-gray-400 mb-2">📧 Email: support@gadgetlease.com</p>
          <p className="text-xs text-gray-400">📞 Phone: +880 1234-567890</p>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} GadgetLease. All working links preserved. Made with TypeScript.
      </div>
    </footer>
  );
}