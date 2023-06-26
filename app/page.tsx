import Image from "next/image";
import Header from "../components/header";
import Content from "../components/content";

export default function Home() {
  return (
    <main className={`bg-slate-900`}>
      <Header />
      <Content />
    </main>
  );
}
