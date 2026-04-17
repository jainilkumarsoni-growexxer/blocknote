


import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useBlocks = (documentId) => {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/documents/${documentId}/blocks`);
      const sorted = (response.data.blocks || []).sort((a, b) => a.order_index - b.order_index);
      setBlocks(sorted);
      setError(null);
      return sorted;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blocks');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const renormalizeOrderIndexes = useCallback(async (blocksToRenorm) => {
    let needsRenorm = false;
    for (let i = 0; i < blocksToRenorm.length - 1; i++) {
      if (blocksToRenorm[i + 1].order_index - blocksToRenorm[i].order_index < 0.001) {
        needsRenorm = true;
        break;
      }
    }
    if (!needsRenorm) return blocksToRenorm;

    const step = 1.0;
    const renormalized = blocksToRenorm.map((block, index) => ({
      ...block,
      order_index: index * step,
    }));

    await api.put(`/documents/${documentId}/blocks/reorder`, {
      blocks: renormalized.map(b => ({ id: b.id, order_index: b.order_index })),
    });

    setBlocks(renormalized);
    return renormalized;
  }, [documentId]);

  const addBlock = useCallback(async (blockData) => {
    try {
      const response = await api.post(`/documents/${documentId}/blocks`, blockData);
      const newBlock = response.data.block;
      setBlocks(prev => {
        const updated = [...prev, newBlock].sort((a, b) => a.order_index - b.order_index);
        return updated;
      });
      return newBlock;
    } catch (err) {
      console.error('Failed to add block:', err);
      throw err;
    }
  }, [documentId]);

  // ✅ OPTIMISTIC UPDATE ONLY – NO IMMEDIATE API CALL
  const updateBlock = useCallback((blockId, content) => {
    setBlocks(prev => prev.map(b =>
      b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b
    ));
    // No API call here – auto‑save will handle persistence
  }, []);

  const deleteBlock = useCallback(async (blockId) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    try {
      await api.delete(`/documents/${documentId}/blocks/${blockId}`);
    } catch (err) {
      console.error('Failed to delete block:', err);
    }
  }, [documentId]);

  const changeBlockType = useCallback(async (blockId, newType) => {
    const defaultContent = { text: '' };
    if (newType === 'todo') defaultContent.checked = false;
    if (newType === 'image') defaultContent.url = '';

    setBlocks(prev => prev.map(b =>
      b.id === blockId ? { ...b, type: newType, content: defaultContent } : b
    ));
    try {
      await api.patch(`/documents/${documentId}/blocks/${blockId}`, { type: newType });
    } catch (err) {
      console.error('Failed to change block type:', err);
    }
  }, [documentId]);

  const moveBlock = useCallback((blockId, newIndex) => {
    setBlocks(prev => {
      const oldIndex = prev.findIndex(b => b.id === blockId);
      if (oldIndex === -1 || oldIndex === newIndex) return prev;

      const newBlocks = [...prev];
      const [moved] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, moved);

      let newOrderIndex;
      if (newIndex === 0) {
        newOrderIndex = (newBlocks[1]?.order_index || 1.0) / 2;
      } else if (newIndex === newBlocks.length - 1) {
        newOrderIndex = newBlocks[newIndex - 1].order_index + 1.0;
      } else {
        newOrderIndex = (newBlocks[newIndex - 1].order_index + newBlocks[newIndex + 1].order_index) / 2;
      }
      newBlocks[newIndex].order_index = newOrderIndex;

      return newBlocks;
    });
  }, []);

  const reorderBlocks = useCallback(async (blocksOrder) => {
    setBlocks(prev => {
      const updated = prev.map(b => {
        const reorderItem = blocksOrder.find(item => item.id === b.id);
        return reorderItem ? { ...b, order_index: reorderItem.order_index } : b;
      });
      const sorted = updated.sort((a, b) => a.order_index - b.order_index);
      setTimeout(() => renormalizeOrderIndexes(sorted), 0);
      return sorted;
    });

    try {
      await api.put(`/documents/${documentId}/blocks/reorder`, { blocks: blocksOrder });
    } catch (err) {
      console.error('Failed to reorder blocks:', err);
      fetchBlocks();
    }
  }, [documentId, fetchBlocks, renormalizeOrderIndexes]);

  return {
    blocks,
    isLoading,
    error,
    fetchBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    changeBlockType,
    moveBlock,
    reorderBlocks,
  };
};