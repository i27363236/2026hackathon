import { ref } from 'vue'

// Undo/redo for the gift-card editor. Each entry is { op: 'add' | 'del', kind, data } holding
// the full object so a redo can restore it. The two primitives are supplied by the caller:
//   remove(entry) — undoes an add / redoes a delete
//   add(entry)    — undoes a delete / redoes an add
export function useUndoHistory({ add, remove }) {
  const undoStack = ref([])
  const redoStack = ref([])

  // Record a new action; any pending redo is invalidated.
  function pushUndo(entry) {
    undoStack.value.push(entry)
    redoStack.value = []
  }

  function undo() {
    const entry = undoStack.value.pop()
    if (!entry) return
    if (entry.op === 'add') remove(entry)
    else add(entry)
    redoStack.value.push(entry)
  }

  function redo() {
    const entry = redoStack.value.pop()
    if (!entry) return
    if (entry.op === 'add') add(entry)
    else remove(entry)
    undoStack.value.push(entry)
  }

  return { undoStack, redoStack, pushUndo, undo, redo }
}
