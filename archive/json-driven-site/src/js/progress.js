const STORAGE_PREFIX = 'tarnished-road:progress';

function storageKey(guideId, version) {
  return `${STORAGE_PREFIX}:${guideId}:${version}`;
}

function readRaw(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeRaw(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/** Load progress for a guide version, migrating item IDs from the prior version if needed. */
export function loadProgress(guideId, version, priorVersion = null) {
  const key = storageKey(guideId, version);
  let progress = readRaw(key);

  if (priorVersion && Object.keys(progress).length === 0) {
    const prior = readRaw(storageKey(guideId, priorVersion));
    if (Object.keys(prior).length > 0) {
      progress = { ...prior };
      writeRaw(key, progress);
    }
  }

  return progress;
}

export function isChecked(progress, itemId) {
  return Boolean(progress[itemId]);
}

export function setChecked(guideId, version, progress, itemId, checked) {
  if (checked) {
    progress[itemId] = true;
  } else {
    delete progress[itemId];
  }
  writeRaw(storageKey(guideId, version), progress);
  return progress;
}

let saveTimer = null;

export function setCheckedDebounced(guideId, version, progress, itemId, checked, delayMs = 150) {
  if (checked) {
    progress[itemId] = true;
  } else {
    delete progress[itemId];
  }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    writeRaw(storageKey(guideId, version), progress);
  }, delayMs);
  return progress;
}

export function countProgress(guide, progress) {
  const items = guide.phases.flatMap((phase) =>
    phase.blocks
      .filter((b) => b.type === 'checklist')
      .flatMap((b) => b.items.map((item) => item.id))
  );
  const total = items.length;
  const completed = items.filter((id) => progress[id]).length;
  return { completed, total };
}

export function attachProgressHandlers(guide, progress, onUpdate) {
  document.querySelectorAll('ul.checklist input[type=checkbox]').forEach((input) => {
    const { id } = input;
    input.checked = isChecked(progress, id);
    input.addEventListener('change', () => {
      setCheckedDebounced(guide.id, guide.version, progress, id, input.checked);
      onUpdate?.();
    });
  });
}
