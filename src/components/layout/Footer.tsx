import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'; // FontAwesome set
import { HiAcademicCap } from 'react-icons/hi'; // HeroIcons set (very clean)

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-purple-500/10 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <HiAcademicCap className="h-7 w-7 text-blue-600" />
              <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          DECENTRA<span className="text-purple-500">WEB</span>
        </Link>            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Empowering the next generation of developers through decentralized learning and verified certification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-1000 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/courses" className="hover:text-blue-600 transition-colors">Browse Courses</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-1000 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Smart Contracts</Link></li>
            </ul>
          </div>

          {/* Social Connect */}
          <div>
            <h4 className="font-semibold text-slate-1000 mb-4">Connect</h4>
            <div className="flex gap-4">
              {/* Replace with your actual GitHub link */}
              <Link 
                href="https://github.com/Web3doctuur-cloud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <FaGithub className="h-6 w-6" />
              </Link>
              <Link href="https://x.com/web3doctuur" 
               target="_blank" 
                rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors">
                <FaTwitter className="h-6 w-6" />
              </Link>
              <Link href="https://linkedin.com/in/rodiah-hadizah-56a36222a" 
               target="_blank" 
                rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-700 transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} DecentraWeb. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span> 
              Sepolia Testnet: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}