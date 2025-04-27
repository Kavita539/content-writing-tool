import React, { useState, useRef, useEffect } from "react";
import ContentBlock from "../components/ContentBlock";

const Editor = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, type: "paragraph", text: "" },
  ]);

  const blockRefs = useRef({});
  const [commandSequence, setCommandSequence] = useState("");


  const addBlock = () => {
    const newBlock = { id: Date.now(), type: "paragraph", text: "" };
    setBlocks(prev => [...prev, newBlock]);
  };

  const updateText = (id, newText) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, text: newText } : block
    ));
  };

  const toggleFormat = (id, format) => {
    setBlocks(blocks.map(block => {
      if (block.id === id) {
        const strippedText = block.text.replace(/<span[^>]*>(.*?)<\/span>/g, '$1');
        let formattedText = strippedText;
        if (format === "bold") formattedText = `<b>${formattedText}</b>`;
        if (format === "italic") formattedText = `<i>${formattedText}</i>`;
        if (format === "underline") formattedText = `<u>${formattedText}</u>`;
        return { ...block, text: formattedText };
      }
      return block;
    }));
  };

  const changeBlockType = (id, newType) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, type: newType } : block
    ));
  };

  const handleHighlight = (id) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    if (range && !selection.isCollapsed) {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.textContent = range.toString();
      range.deleteContents();
      range.insertNode(span);
      selection.removeAllRanges();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.userAgent.includes("Mac");
  
      if ((isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && e.key === "8") {
        e.preventDefault();
        addBlock();
        return;
      }
  
      if (e.key === "/") {
        setCommandSequence("/");
        return;
      }
  
      if (commandSequence.startsWith("/")) {
        const updatedSeq = commandSequence + e.key.toLowerCase();
        setCommandSequence(updatedSeq);
  
        const lastBlock = blocks[blocks.length - 1];
        if (!lastBlock) return;
  
        if (updatedSeq === "/bold") {
          toggleFormat(lastBlock.id, "bold");
          setCommandSequence("");
        } else if (updatedSeq === "/italic") {
          toggleFormat(lastBlock.id, "italic");
          setCommandSequence("");
        } else if (updatedSeq === "/underline") {
          toggleFormat(lastBlock.id, "underline");
          setCommandSequence("");
        } else if (updatedSeq === "/heading") {
          changeBlockType(lastBlock.id, "heading");
          setCommandSequence("");
        } else if (updatedSeq.length > 20) {
          setCommandSequence("");
        }
        return;
      }
  
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const focused = document.activeElement;
        const blockIds = blocks.map((b) => b.id);
        const currentIndex = blockIds.findIndex(
          (id) => blockRefs.current[id]?.contains(focused)
        );
  
        if (currentIndex === -1) return;
  
        let nextIndex = currentIndex;
        if (e.key === "ArrowDown" && currentIndex < blockIds.length - 1) nextIndex++;
        if (e.key === "ArrowUp" && currentIndex > 0) nextIndex--;
  
        const nextId = blockIds[nextIndex];
        const nextEl = blockRefs.current[nextId]?.querySelector("[contenteditable]");
        if (nextEl) {
          e.preventDefault();
          nextEl.focus();
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blocks, commandSequence]);
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Beginner Rich Text Editor</h1>

      {blocks.map((block) => (
        <div key={block.id} ref={(el) => (blockRefs.current[block.id] = el)}>
          <ContentBlock
            block={block}
            updateText={updateText}
            toggleFormat={toggleFormat}
            changeBlockType={changeBlockType}
            highlightText={() => handleHighlight(block.id)}
          />
        </div>
      ))}

      <button
        onClick={addBlock}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add New Block
      </button>
    </div>
  );
};

export default Editor;
