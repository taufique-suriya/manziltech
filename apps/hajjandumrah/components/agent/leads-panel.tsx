"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { buttonClasses } from "@manziltech/ui";
import type { LeadStatus, LeadView, SignedInAgent } from "@/data/types";
import { lostReasons } from "@/data/seed/templates";
import { Badge, Field, inputClass, selectClass } from "@/components/fields";
import { Modal } from "@/components/modal";
import { leadStatusLabels, updateLead } from "@/lib/api";
import { formatDate, plural, todayIso } from "@/lib/format";
import { limits, validateDate, validateText } from "@manziltech/validation";
import { maskMobile, whatsappLink } from "@/lib/mobile";

const statuses: LeadStatus[] = ["new", "contacted", "follow-up", "booked", "lost"];
const tone: Record<LeadStatus, "accent" | "warm" | "muted" | "danger"> = { new: "warm", contacted: "accent", "follow-up": "accent", booked: "accent", lost: "muted" };

const isOpen = (lead: LeadView) => lead.status !== "booked" && lead.status !== "lost";
const hoursSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 3_600_000;

export function LeadsPanel({ agent, leads, onChanged }: { agent: SignedInAgent; leads: LeadView[]; onChanged: () => void }) {
  const [filter, setFilter] = useState<"open" | LeadStatus | "all" | "due">("open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = todayIso();

  const shown = leads.filter((lead) => {
    if (filter === "all") return true;
    if (filter === "open") return isOpen(lead);
    if (filter === "due") return isOpen(lead) && lead.nextFollowUpAt !== undefined && lead.nextFollowUpAt <= today;
    return lead.status === filter;
  });
  const selected = leads.find((l) => l.id === selectedId) ?? null;

  const chips: { key: typeof filter; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "due", label: "Follow-up due" },
    ...statuses.map((s) => ({ key: s, label: leadStatusLabels[s] })),
    { key: "all", label: "All" },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter leads">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={filter === c.key}
            onClick={() => setFilter(c.key)}
            className={`rounded-sm border px-3 py-1.5 text-sm font-medium ${filter === c.key ? "border-accent bg-accent-tint text-accent-strong" : "border-line text-ink-soft hover:border-accent"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-10 text-center text-sm text-ink-soft">No leads here yet. New enquiries for your packages appear in this list.</div>
      ) : (
        <ul className="grid gap-3">
          {shown.map((lead) => (
            <li key={lead.id}>
              <button
                type="button"
                onClick={() => setSelectedId(lead.id)}
                className="grid w-full gap-1 rounded-lg border border-line bg-paper p-4 text-left transition-colors hover:border-accent"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <Badge tone={tone[lead.status]}>{leadStatusLabels[lead.status]}</Badge>
                  {lead.status === "new" && hoursSince(lead.createdAt) > 24 && <Badge tone="danger">Waiting over 24 hours</Badge>}
                  {isOpen(lead) && lead.nextFollowUpAt && lead.nextFollowUpAt <= today && <Badge tone="warm">Follow-up due</Badge>}
                  <span className="font-mono text-xs text-muted">{lead.reference}</span>
                </span>
                <span className="font-medium">{lead.customer.name}</span>
                <span className="text-sm text-ink-soft">
                  {lead.packageTitle} · {plural(lead.adults + lead.children + lead.infants, "traveller")} · {maskMobile(lead.customer.mobile)} · {formatDate(lead.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && <LeadDialog key={selected.id} lead={selected} agent={agent} onClose={() => setSelectedId(null)} onChanged={onChanged} />}
    </div>
  );
}

function LeadDialog({ lead, agent, onClose, onChanged }: { lead: LeadView; agent: SignedInAgent; onClose: () => void; onChanged: () => void }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [followUp, setFollowUp] = useState(lead.nextFollowUpAt ?? "");
  const [reason, setReason] = useState<string>(lead.lostReason ?? lostReasons[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [followUpError, setFollowUpError] = useState<string | undefined>();
  const [noteError, setNoteError] = useState<string | undefined>();

  async function run(update: Parameters<typeof updateLead>[2]) {
    setError(null);
    try {
      await updateLead(agent, lead.id, update);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The change could not be saved.");
    }
  }

  function saveStatus(event: FormEvent) {
    event.preventDefault();
    const dateError = status === "follow-up" ? validateDate(followUp, { label: "the follow-up date", notBefore: todayIso() }) : null;
    setFollowUpError(dateError ?? undefined);
    if (dateError) return;
    void run({ kind: "status", status, followUpOn: status === "follow-up" ? followUp || undefined : undefined, lostReason: status === "lost" ? reason : undefined });
  }

  function addNote(event: FormEvent) {
    event.preventDefault();
    const problem = validateText(note, { label: "a note", max: limits.note });
    setNoteError(problem ?? undefined);
    if (problem) return;
    void run({ kind: "note", text: note.trim() });
    setNote("");
  }

  return (
    <Modal open onClose={onClose} wide title={lead.customer.name} description={`${lead.packageTitle} · ${lead.reference}`}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid content-start gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${lead.customer.mobile}`} className={buttonClasses("secondary", "py-2")}>
              <Phone className="size-4" aria-hidden="true" /> Call {lead.customer.mobile}
            </a>
            <a href={whatsappLink(lead.customer.mobile)} target="_blank" rel="noreferrer" className={buttonClasses("secondary", "py-2")}>
              <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
            </a>
          </div>
          <dl className="grid gap-1 text-ink-soft">
            <div>Prefers: {lead.contactPreference === "whatsapp" ? "WhatsApp" : "a call"}</div>
            <div>
              Travellers: {plural(lead.adults, "adult")}
              {lead.children ? `, ${plural(lead.children, "child", "children")}` : ""}
              {lead.infants ? `, ${plural(lead.infants, "infant")}` : ""}
            </div>
            {lead.preferredDeparture && <div>Preferred departure: {lead.preferredDeparture}</div>}
            {lead.customer.city && <div>City: {lead.customer.city}</div>}
            {lead.customer.email && <div>Email: {lead.customer.email}</div>}
            {lead.message && <div>Message: {lead.message}</div>}
          </dl>

          <form onSubmit={saveStatus} className="grid gap-3 rounded-lg border border-line p-3">
            <Field label="Status" htmlFor="ld-status" required>
              <select id="ld-status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className={selectClass}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {leadStatusLabels[s]}
                  </option>
                ))}
              </select>
            </Field>
            {status === "follow-up" && (
              <Field label="Follow up on" htmlFor="ld-follow" required error={followUpError}>
                <input id="ld-follow" type="date" value={followUp} min={todayIso()} onChange={(e) => setFollowUp(e.target.value)} className={inputClass} />
              </Field>
            )}
            {status === "lost" && (
              <Field label="Reason" htmlFor="ld-reason" required>
                <select id="ld-reason" value={reason} onChange={(e) => setReason(e.target.value)} className={selectClass}>
                  {lostReasons.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            )}
            <button type="submit" className={buttonClasses("primary", "py-2")}>
              Update status
            </button>
          </form>

          <form onSubmit={addNote} className="grid gap-2">
            <Field label="Add a note" htmlFor="ld-note" required error={noteError}>
              <textarea id="ld-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={limits.note} className={inputClass} />
            </Field>
            <button type="submit" className={buttonClasses("secondary", "w-fit py-2")}>
              Save note
            </button>
          </form>
          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
        </div>

        <section className="grid content-start gap-2 text-sm" aria-label="Timeline">
          <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent-strong">Timeline</h3>
          <ol className="grid gap-3 border-l border-line pl-4">
            {[...lead.activity].reverse().map((a) => (
              <li key={a.id}>
                <p>{a.text}</p>
                <p className="text-xs text-muted">
                  {formatDate(a.at)} · {a.by}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Modal>
  );
}
