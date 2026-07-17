import Link from 'next/link';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight text-white">SENO Studio</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-zinc-800 text-white">
          <LayoutDashboard size={18} />
          Overview
        </Link>
        <Link href="/standups" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
          <Users size={18} />
          Standups
        </Link>
        <Link href="/logs" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
          <Activity size={18} />
          Activity Logs
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
          <LogOut size={18} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
