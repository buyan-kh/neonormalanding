import { TerminalWindow } from "@/components/TerminalWindow";

const field =
  "mt-1 w-full border border-[#0A0A0A]/40 bg-white px-2 py-1.5 font-sans text-[13px] text-[#0A0A0A] outline-none placeholder:text-[#5A5852] hover:border-[#0A0A0A]/70 focus:border-[#0A0A0A] focus:bg-[#fafafa]";

export function LoginGate({ denied = false, nextPath = null }: { denied?: boolean; nextPath?: string | null }) {
  return (
    <main id="content" className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <TerminalWindow title="INSIDE // SIGN IN" bodyClassName="p-4">
          <form method="post" action="/api/inside-auth" className="space-y-3">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <label className="block font-mono text-[11px] text-[#5A5852]">
              Name
              <input
                className={field}
                name="name"
                type="text"
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                required
                maxLength={80}
              />
            </label>
            <label className="block font-mono text-[11px] text-[#5A5852]">
              Passcode
              <input
                className={field}
                name="passcode"
                type="password"
                autoComplete="current-password"
                required
                maxLength={200}
              />
            </label>
            {denied ? (
              <p className="text-[12px] text-[#0A0A0A]" role="alert">
                That name or passcode is wrong.
              </p>
            ) : null}
            <button
              type="submit"
              className="bg-[#D9D9D9] px-3 py-2 text-[12px] text-[#303030] hover:bg-[#C9C9C9]"
            >
              [Enter Workspace]
            </button>
          </form>
        </TerminalWindow>
      </div>
    </main>
  );
}
