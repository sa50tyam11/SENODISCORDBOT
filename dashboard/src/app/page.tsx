import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-8 border-b border-zinc-800 bg-[#09090b]">
          <h2 className="text-sm text-zinc-400">Dashboard / Overview</h2>
        </header>
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Welcome back, {session?.user?.name}</h1>
            <p className="text-zinc-400 mb-8">Here is an overview of your studio's activity.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-zinc-800 bg-[#121214] shadow-sm">
                <h3 className="text-zinc-400 text-sm font-medium mb-1">Total Standups</h3>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-800 bg-[#121214] shadow-sm">
                <h3 className="text-zinc-400 text-sm font-medium mb-1">Active Projects</h3>
                <p className="text-3xl font-bold text-white">4</p>
              </div>
              <div className="p-6 rounded-xl border border-zinc-800 bg-[#121214] shadow-sm">
                <h3 className="text-zinc-400 text-sm font-medium mb-1">Uptime</h3>
                <p className="text-3xl font-bold text-[#84cc16]">99.9%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
