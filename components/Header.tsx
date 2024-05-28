import Link from "next/link";
import AuthButton from "./AuthButton";
import SupabaseLogo from "./SupabaseLogo";
import { createClient } from "@/utils/supabase/server";

export default function Header() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex justify-between p-4 border-b border-slate-800 text-white">
      <Link href="/" className="text-xl font-bold flex items-center">
        <SupabaseLogo />
        <span className="mx-2">-</span>ToDo
      </Link>
      {isSupabaseConnected && <AuthButton />}
    </div>
  );
}
