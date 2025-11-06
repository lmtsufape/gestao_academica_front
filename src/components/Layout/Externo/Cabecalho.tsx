import React from 'react';
import Link from 'next/link';
import theme from "@/theme/theme";
import { usePathname } from 'next/navigation';
import Image from "next/image";


const Cabecalho = ({ dados }: any) => {
  const pathname = usePathname()
  return (
    <header className="bg-white shadow-md border-b border-neutrals-300 px-8 py-4 flex justify-between items-center relative z-10">
      <Image
        src="/assets/SGU.png"
        alt="logo SGU"
        width={60}
        height={60}
      />
      <nav className="flex gap-6 text-extra-50 font-semibol">
        {pathname !== "/login" && (
          <Link href="/login" className="hover:text-extra-150 transition border-2 p-2 rounded-3xl border-extra-50 hover:border-extra-150">Login</Link>
        )}
      </nav>
    </header>

  );
};

export default Cabecalho;