export function Footer() {
  return (
    <footer className="border-t border-[#EFECE6]/70">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-8 text-[12px] md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="text-[14px] tracking-[0.16em]">Neo Norma</p>
          <p className="mt-2 text-[#9E9A90]">Neo Norma // San Francisco, CA</p>
        </div>
        <nav className="flex flex-col gap-2 sm:flex-row sm:gap-4" aria-label="Contact">
          <a href="https://x.com/buyan_kh" className="underline decoration-[#EFECE6]/40 underline-offset-4 hover:decoration-[#EFECE6]" target="_blank" rel="noreferrer">
            X @buyan_kh
          </a>
          <a
            href="https://www.linkedin.com/in/buyankh"
            className="underline decoration-[#EFECE6]/40 underline-offset-4 hover:decoration-[#EFECE6]"
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/buyankh
          </a>
          <a href="#request" className="underline decoration-[#EFECE6]/40 underline-offset-4 hover:decoration-[#EFECE6]">
            Email intake
          </a>
        </nav>
      </div>
    </footer>
  );
}
