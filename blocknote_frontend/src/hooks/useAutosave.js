



import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../services/api';

export const useAutosave = (documentId, blocks, options = {}) => {
  const { debounceMs = 1000, debug = false } = options;

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const versionRef = useRef(0);
  
  const blocksRef = useRef(blocks);
  const documentIdRef = useRef(documentId);
  const debugRef = useRef(debug);

  useEffect(() => { blocksRef.current = blocks; }, [blocks]);
  useEffect(() => { documentIdRef.current = documentId; }, [documentId]);
  useEffect(() => { debugRef.current = debug; }, [debug]);

  const performSave = useCallback(async (blocksToSave, saveVersion) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (debugRef.current) console.log(`[Autosave] 🚀 Sending save v${saveVersion}`);

    try {
      await api.post(
        `/documents/${documentIdRef.current}/blocks/batch`,
        { blocks: blocksToSave, version: saveVersion },
        { signal: controller.signal }
      );

      if (saveVersion === versionRef.current) {
        if (debugRef.current) console.log(`[Autosave] ✅ Save v${saveVersion} succeeded`);
        setSaveStatus('saved');
      } else {
        if (debugRef.current) console.log(`[Autosave] ⏭️ Save v${saveVersion} ignored`);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        if (debugRef.current) console.log(`[Autosave] 🛑 Save v${saveVersion} aborted`);
      } else {
        console.error('[Autosave] ❌ Failed:', err);
        if (saveVersion === versionRef.current) {
          setSaveStatus('error');
          // Auto‑recover after 3 seconds
          setTimeout(() => {
            if (versionRef.current === saveVersion) {
              setSaveStatus('saved');
            }
          }, 3000);
        }
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const triggerSave = useCallback(() => {
    // Clear pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (debugRef.current) console.log('[Autosave] ⏸️ Debounce cleared');
    }

    // Abort any in‑flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      if (debugRef.current) console.log('[Autosave] 🛑 In‑flight request aborted');
    }

    const currentVersion = ++versionRef.current;
    // Status stays 'saved' until we actually start the network request

    if (debugRef.current) console.log(`[Autosave] ⏳ Will save v${currentVersion} in ${debounceMs}ms`);

    timeoutRef.current = setTimeout(() => {
      if (debugRef.current) console.log(`[Autosave] ⏰ Debounce timer fired for v${currentVersion}`);
      setSaveStatus('saving'); // ← NOW we show "Saving…"
      performSave(blocksRef.current, currentVersion);
      timeoutRef.current = null;
    }, debounceMs);
  }, [debounceMs, performSave]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return { saveStatus, triggerSave };
};