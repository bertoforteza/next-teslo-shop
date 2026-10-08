"use client";

import { useUIStore } from "@/store";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUIStore((state) => state.closeSideMenu);
  const router = useRouter();

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="">
      {isSideMenuOpen && (
        <>
          {/* Background black */}

          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />

          {/* Baskground blur */}
          <div
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
            onClick={closeSideMenu}
          />
        </>
      )}

      {/* Side menu */}
      <nav
        className={clsx(
          "fixed p.5 right-0 top-0 w-125 h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          { "translate-x-full": !isSideMenuOpen },
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeSideMenu}
        />

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href={"/profile"}
              onClick={closeSideMenu}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={30} />
              <span className="ml-2 text-xl">Perfil</span>
            </Link>

            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-2 text-xl">Órdenes</span>
            </Link>

            <button
              className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={async () => {
                closeSideMenu();
                await signOut({ redirect: false });
                router.refresh();
              }}
            >
              <IoLogOutOutline size={30} />
              <span className="ml-2 text-xl">Salir</span>
            </button>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href={"/auth/login"}
            onClick={closeSideMenu}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-2 text-xl">Iniciar sesión</span>
          </Link>
        )}

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-2 text-xl">Productos</span>
            </Link>

            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-2 text-xl">Órdenes</span>
            </Link>

            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-2 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
