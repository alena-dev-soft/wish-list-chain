import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">WishList Chain</h1>
      <p className="text-gray-400">Собирай донаты на свою мечту</p>
      <ConnectButton />
    </main>
  )
}
