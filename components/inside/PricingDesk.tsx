"use client";

import { useState } from "react";
import { FlowLine } from "@/components/FlowLine";
import { TerminalWindow } from "@/components/TerminalWindow";
import {
  cashCommission,
  commissionDeals,
  formatDollars,
  payoutRules,
  priceCards,
  roles,
  type RoleId,
} from "@/components/inside/content";

const dealCounts = [1, 2, 3, 4, 5];

export function PricingDesk() {
  const [roleId, setRoleId] = useState<RoleId>("full");
  const [dealId, setDealId] = useState("standard");
  const [count, setCount] = useState(1);
  const role = roles.find((item) => item.id === roleId) ?? roles[1];
  const deal = commissionDeals.find((item) => item.id === dealId) ?? commissionDeals[2];
  const dataPercent = Math.min(role.percent, 15);
  const cashTotal = cashCommission(deal.amount, role.percent, count);
  const exampleHalf = 65000;
  const examplePay = cashCommission(exampleHalf, dataPercent, 1);

  return (
    <section id="pricing" className="scroll-mt-32 border-t border-[#0A0A0A]/20">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-6">
        <p className="text-[11px] tracking-[0.18em] text-[#5A5852]">02 // PRICING MENU & INTERACTIVE COMMISSION CALCULATOR</p>
        <h2 className="mt-3 max-w-[18em] text-[24px] leading-snug md:text-[26px]">What buyers can purchase today.</h2>
        <p className="mt-4 max-w-[68ch] text-[13px] leading-relaxed text-[#5A5852]">
          Three prices. Quote one of these. Do not invent a fourth.
        </p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {priceCards.map((card, index) => (
            <div key={card.kicker} className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <article className="flex h-full flex-1 flex-col border border-[#0A0A0A] bg-white p-4">
                <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">{card.kicker}</p>
                <h3 className="mt-3 font-mono text-[18px] leading-snug tabular-nums">{card.price}</h3>
                <p className="mt-2 text-[12px] text-[#0A0A0A]">{card.scope}</p>
                <p className="mt-3 flex-1 text-[12px] leading-relaxed text-[#5A5852]">{card.body}</p>
                <div className="mt-4 border border-dashed border-[#0A0A0A] px-2 py-2">
                  <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">{card.hookLabel}</p>
                  <p className="mt-1 text-[12px] leading-relaxed">{card.hook}</p>
                </div>
              </article>
              {index < priceCards.length - 1 ? (
                <>
                  <FlowLine className="hidden lg:block" length={40} />
                  <FlowLine className="lg:hidden" direction="vertical" length={28} />
                </>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)] lg:items-start">
          <TerminalWindow title="Rep commission calculator" className="h-full" bodyClassName="p-3 md:p-4">
            <fieldset>
              <legend className="text-[11px] text-[#5A5852]">Role / tier</legend>
              <div className="mt-2 grid gap-2" role="radiogroup" aria-label="Commission role">
                {roles.map((item) => {
                  const on = roleId === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`cursor-pointer border px-2 py-2 text-[12px] focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-[#0A0A0A] ${
                        on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="commission-role"
                        value={item.id}
                        checked={on}
                        onChange={() => setRoleId(item.id)}
                      />
                      <span className="block">{item.label}</span>
                      <span className={`mt-1 block text-[12px] leading-relaxed ${on ? "text-[#303030]" : "text-[#5A5852]"}`}>
                        {item.detail}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-4">
              <legend className="text-[11px] text-[#5A5852]">Deal size</legend>
              <div className="mt-2 grid gap-2" role="radiogroup" aria-label="Deal size">
                {commissionDeals.map((item) => {
                  const on = dealId === item.id;
                  const perDeal =
                    item.kind === "cash" ? formatDollars(cashCommission(item.amount, role.percent, 1)) : "10% to 15%";
                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-start justify-between gap-3 border px-2 py-2 text-[12px] focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-[#0A0A0A] ${
                        on ? "border-[#C5C5C5] bg-[#E4E4E4] text-[#303030]" : "border-[#0A0A0A]/40 text-[#0A0A0A]"
                      }`}
                    >
                      <span>
                        <input
                          className="sr-only"
                          type="radio"
                          name="deal-size"
                          value={item.id}
                          checked={on}
                          onChange={() => setDealId(item.id)}
                        />
                        {item.label}
                      </span>
                      <span className="shrink-0 font-mono tabular-nums">{perDeal}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-4">
              <p className="text-[11px] text-[#5A5852]" id="deal-count-label">
                {deal.kind === "share" ? "Number of data partners" : "Number of deals"} (1 to 5)
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="deal-count-label">
                {dealCounts.map((value) => {
                  const on = count === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setCount(value)}
                      className={`min-w-9 px-2 py-1 font-mono text-[12px] tabular-nums ${
                        on ? "bg-[#D9D9D9] text-[#303030]" : "border border-[#0A0A0A]/40 text-[#0A0A0A] hover:bg-[#EAEAEA]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 border border-dashed border-[#0A0A0A] px-3 py-3" aria-live="polite">
              {deal.kind === "cash" ? (
                <>
                  <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">You earn</p>
                  <p className="mt-2 font-mono text-[28px] leading-none tabular-nums">{formatDollars(cashTotal)}</p>
                  <p className="mt-3 text-[12px] leading-relaxed text-[#5A5852]">
                    {role.percent}% of {formatDollars(deal.amount)} x {count} {count === 1 ? "deal" : "deals"}.{" "}
                    {deal.label}.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[10px] tracking-[0.14em] text-[#5A5852]">Data partner commission</p>
                  <p className="mt-2 font-mono text-[22px] leading-none">10% to 15% of our half</p>
                  <p className="mt-3 text-[12px] leading-relaxed text-[#5A5852]">
                    You earn {dataPercent}% of Neo Norma&apos;s net revenue share on every AI lab sale from that
                    partner&apos;s tests, for 12 months. This track pays 10% to 15%, including when your cash-deal tier
                    is 20%.
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">
                    Example: an AI lab pays $130,000. Neo Norma&apos;s half is {formatDollars(exampleHalf)}. At{" "}
                    {dataPercent}% you earn {formatDollars(examplePay)} on that sale.
                    {count > 1 ? ` You marked ${count} partners. The example is per partner, not a combined total.` : ""}
                  </p>
                </>
              )}
            </div>
          </TerminalWindow>

          <TerminalWindow title="Payout rules" className="h-full" bodyClassName="space-y-3 p-3 md:p-4">
            {payoutRules.map((rule) => (
              <div key={rule.title} className="border border-dashed border-[#0A0A0A] px-2 py-2">
                <p className="text-[12px]">{rule.title}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#5A5852]">{rule.body}</p>
              </div>
            ))}
            <p className="text-[12px] leading-relaxed text-[#5A5852]">
              Buyer hook and your protection are different clocks. The buyer&apos;s pilot fee rolls into the pack if they
              upgrade within 30 days. Your commission on that upgrade is protected for 90 days.
            </p>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
