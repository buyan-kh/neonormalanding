"use client";

import { useSyncExternalStore } from "react";
import { categoryFilters, defaultLeads, stages, type Lead, type LeadCategory, type LeadStage } from "@/components/inside/leads";

const STORAGE_KEY = "neonorma-inside-board-v1";

const stageIds = new Set<string>(stages.map((stage) => stage.id));
const categoryIds = new Set<string>(categoryFilters.map((item) => item.id).filter((id) => id !== "all"));

let snapshot: Lead[] = defaultLeads;
let loaded = false;
const listeners = new Set<() => void>();

function isLead(value: unknown): value is Lead {
  if (!value || typeof value !== "object") return false;
  const lead = value as Partial<Lead>;
  return (
    typeof lead.id === "string" &&
    typeof lead.company === "string" &&
    typeof lead.category === "string" &&
    categoryIds.has(lead.category) &&
    typeof lead.stage === "string" &&
    stageIds.has(lead.stage) &&
    typeof lead.contacts === "string" &&
    typeof lead.package === "string" &&
    typeof lead.notes === "string" &&
    typeof lead.hook === "string" &&
    (lead.site === undefined || typeof lead.site === "string")
  );
}

function readStored(): Lead[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isLead)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const stored = readStored();
  if (stored) snapshot = stored;
}

function publish(next: Lead[]) {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing can refuse storage. The board still updates for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return snapshot;
}

function getServerSnapshot() {
  return defaultLeads;
}

export function useLeadBoard() {
  const leads = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    leads,
    moveLead(id: string, stage: LeadStage) {
      publish(getSnapshot().map((lead) => (lead.id === id ? { ...lead, stage } : lead)));
    },
    addLead(lead: Lead) {
      publish([lead, ...getSnapshot()]);
    },
    resetLeads() {
      publish(defaultLeads.map((lead) => ({ ...lead })));
    },
  };
}

export function isLeadCategory(value: string): value is LeadCategory {
  return categoryIds.has(value);
}

export function isLeadStage(value: string): value is LeadStage {
  return stageIds.has(value);
}
