// What the first page load is still waiting on. Components take a hold while they fetch or
// set something up, and the loading curtain stays down until every hold is released.
type Task = { label: string; done: boolean };

const tasks: Task[] = [];
const waiting = new Set<() => void>();
let revealed = false;

// Take a hold with the words to show while it is pending. Call the result to release it.
// After the curtain has lifted this does nothing, so later page changes never wait.
export function hold(label: string): () => void {
  if (revealed) return () => {};
  const task = { label, done: false };
  tasks.push(task);
  return () => {
    task.done = true;
  };
}

export function progress() {
  const pending = tasks.find((t) => !t.done);
  return { done: tasks.filter((t) => t.done).length, total: tasks.length, label: pending?.label ?? null };
}

export const isRevealed = () => revealed;

// The curtain calls this as it starts to lift.
export function reveal() {
  if (revealed) return;
  revealed = true;
  for (const fn of waiting) fn();
  waiting.clear();
}

// Run something when the page is first shown, or at once if it already has been.
export function onReveal(fn: () => void): () => void {
  if (revealed) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => {
    waiting.delete(fn);
  };
}
