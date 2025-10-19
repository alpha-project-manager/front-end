import { Meeting, MeetingSlotOption, ParticipantAvailability } from "@/types/meeting";

const meetings: Meeting[] = [];

export async function createMeeting(payload: Omit<Meeting, "id" | "selectedSlot" | "notificationsSent">): Promise<Meeting> {
  await delay(150);
  const created: Meeting = { id: String(Date.now()), ...payload, selectedSlot: undefined, notificationsSent: false };
  meetings.push(created);
  return created;
}

export async function proposeSlots(meetingId: string, slots: MeetingSlotOption[]): Promise<Meeting> {
  await delay(120);
  const m = find(meetingId);
  m.slotOptions = mergeVotes(m.slotOptions, slots);
  return m;
}

export async function chooseOptimalSlot(meetingId: string, participantsAvailability: ParticipantAvailability[]): Promise<Meeting> {
  await delay(200);
  const m = find(meetingId);
  const scored = m.slotOptions.map((slot) => ({
    slot,
    score: scoreSlot(slot, participantsAvailability),
  }));
  scored.sort((a, b) => b.score - a.score);
  m.selectedSlot = scored[0]?.slot ? { start: scored[0].slot.start, end: scored[0].slot.end } : undefined;
  return m;
}

export async function sendNotifications(meetingId: string): Promise<void> {
  await delay(100);
  const m = find(meetingId);
  m.notificationsSent = true;
}

function scoreSlot(slot: MeetingSlotOption, availability: ParticipantAvailability[]): number {
  const votesScore = slot.votes.reduce((acc, v) => acc + v.vote, 0);
  const conflicts = availability.some((a) => a.busySlots.some((b) => overlaps(slot.start, slot.end, b.start, b.end)));
  return votesScore + (conflicts ? -10 : 0);
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return !(new Date(aEnd) <= new Date(bStart) || new Date(aStart) >= new Date(bEnd));
}

function mergeVotes(existing: MeetingSlotOption[], incoming: MeetingSlotOption[]): MeetingSlotOption[] {
  const map = new Map<string, MeetingSlotOption>();
  const key = (s: MeetingSlotOption) => `${s.start}-${s.end}`;
  [...existing, ...incoming].forEach((s) => {
    const k = key(s);
    const prev = map.get(k);
    if (!prev) map.set(k, { ...s });
    else map.set(k, { ...prev, votes: [...prev.votes, ...s.votes] });
  });
  return [...map.values()];
}

function find(id: string): Meeting {
  const m = meetings.find((x) => x.id === id);
  if (!m) throw new Error("Встреча не найдена");
  return m;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}


