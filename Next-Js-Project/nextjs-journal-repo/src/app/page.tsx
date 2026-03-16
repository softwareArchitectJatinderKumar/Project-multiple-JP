import Image from "next/image";
import styles from "./page.module.css";
import JournalMenuBar from "@/component/TopMenubar/JournalMenuBar";
import JournalCarousel from "@/component/journalCarousel/JournalCarousel";
import JournalPopularByGenre from "@/component/journalPopularByGenre/JournalPopularByGenre";

export default function Home() {
  return (
    < >
     <JournalMenuBar />
     <JournalCarousel />
     <JournalPopularByGenre />
    </>
  );
}
