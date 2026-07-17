import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import db from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function StandupsPage() {
  const session = await getServerSession(authOptions);

  // Fetch standups from sqlite
  const standups = db.prepare('SELECT * FROM standup_logs ORDER BY createdAt DESC LIMIT 50').all();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-8 border-b border-zinc-800 bg-[#09090b]">
          <h2 className="text-sm text-zinc-400">Dashboard / Standups</h2>
        </header>
        
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Daily Standups</h1>
            <p className="text-zinc-400 mb-8">Recent team updates and blockers.</p>
            
            <div className="space-y-6">
              {standups.map((log: any) => (
                <div key={log.id} className="p-6 rounded-xl border border-zinc-800 bg-[#121214] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-medium">
                        {log.userId.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">User {log.userId}</h3>
                        <p className="text-xs text-zinc-500">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Yesterday</h4>
                      <p className="text-zinc-300 text-sm whitespace-pre-wrap">{log.yesterday}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Today</h4>
                      <p className="text-zinc-300 text-sm whitespace-pre-wrap">{log.today}</p>
                    </div>
                  </div>
                  
                  {log.blockers && log.blockers.toLowerCase() !== 'none' && (
                    <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Blockers</h4>
                      <p className="text-red-300 text-sm">{log.blockers}</p>
                    </div>
                  )}
                </div>
              ))}

              {standups.length === 0 && (
                <div className="p-12 text-center rounded-xl border border-zinc-800 border-dashed">
                  <p className="text-zinc-500">No standups submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
