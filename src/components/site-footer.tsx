import { ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-portfolio-brand mt-20 rounded-t-[25px] p-[45px] text-white max-[760px]:px-6 max-[760px]:py-[30px]">
      <div>
        <h2 className="font-display mb-5 text-[42px] tracking-[-1.5px] max-[760px]:text-[32px]">
          Let’s build something.
        </h2>
        <a
          className="inline-flex items-center gap-2"
          href="mailto:zackfxg@gmail.com"
        >
          zackfxg@gmail.com <ArrowUpRight />
        </a>
      </div>
      <div className="border-portfolio-footer-line text-portfolio-on-brand mt-[50px] flex flex-wrap justify-between gap-5 border-t pt-7 text-xs">
        <span>© {new Date().getFullYear()} Ahmad Zacky</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
