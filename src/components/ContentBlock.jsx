import React, { useRef, useEffect } from "react";

const getBlockStyle = (block) => {
  switch (block.type) {
    case "heading":
      return { fontSize: "24px", fontWeight: "bold" };
    case "quote":
      return { fontStyle: "italic", borderLeft: "4px solid gray", paddingLeft: "10px" };
    default:
      return { fontSize: "16px" };
  }
};

const ContentBlock = ({
  block,
  updateText,
  toggleFormat,
  changeBlockType,
  highlightText,
}) => {
  const contentRef = useRef();

  // When block text updates from outside (like formatting), apply it
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== block.text) {
      contentRef.current.innerHTML = block.text;
    }
  }, [block.text]);

  const handleInput = () => {
    updateText(block.id, contentRef.current.innerHTML);
  };

  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        className="block w-full border p-2 rounded focus:outline-none"
        style={getBlockStyle(block)}
        suppressContentEditableWarning={true}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <button onClick={() => toggleFormat(block.id, "bold")} className="bg-blue-500 text-white px-3 py-1 rounded">Bold</button>
        <button onClick={() => toggleFormat(block.id, "italic")} className="bg-green-500 text-white px-3 py-1 rounded">Italic</button>
        <button onClick={() => toggleFormat(block.id, "underline")} className="bg-purple-500 text-white px-3 py-1 rounded">Underline</button>

        <button onClick={() => changeBlockType(block.id, "heading")} className="bg-orange-500 text-white px-3 py-1 rounded">Heading</button>
        <button onClick={() => changeBlockType(block.id, "quote")} className="bg-yellow-600 text-white px-3 py-1 rounded">Quote</button>

        <button onClick={() => highlightText(block.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Highlight</button>
      </div>
    </div>
  );
};

export default ContentBlock;
