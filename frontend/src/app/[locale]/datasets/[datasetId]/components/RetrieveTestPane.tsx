import clsx from "clsx";
import { useState } from "react";
import { RiTextBlock } from "react-icons/ri";

const RetrieveTestPane = ({ dataset }: any) => {
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [chunks, setChunks] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const handleSend = async () => {
    setIsTesting(true);
    try {
      // Send test message
      await fetch(`/api/datasets/${dataset.id}/retrieve`, {
        method: "POST",
        body: JSON.stringify({ query, top_k: 5 }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to send test message ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setChunks(data);
        });
      setLastQuery(query);
      setQuery(""); // clear input only when sent successfully
    } catch (error) {
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };
  const handleKeyDown = (event: any) => {
    // event.nativeEvent.isComposing === true when the user is typing in a CJK IME.
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="flex flex-col w-full h-full max-w-md shadow-box shadow-gray-700 gap-2 border border-base-content/20 rounded-md">
      <div className="flex items-center justify-between gap-1 p-2 text-sm">
        <div className="flex items-center gap-1 font-bold">
          <RiTextBlock className="w-5 h-5 flex-shrink-0" />
          Retrieval Test {lastQuery && `: ${lastQuery}`}
        </div>
        <div className="text-xs text-success/50 border border-success/50 bg-success/20 rounded-md px-2 py-0.5">
          Vector Search
        </div>
      </div>
      <div className="flex flex-col w-full flex-grow overflow-y-auto gap-1 p-1">
        {chunks.map((chunk: any, index: number) => (
          <div
            key={index}
            className="flex flex-col gap-1 p-2 bg-base-content/10 rounded-md"
          >
            <div className="flex items-center justify-between p-1 text-xs text-base-content/50 border-b border-base-content/10">
              <span className="flex items-center gap-1">
                <RiTextBlock className="w-4 h-4 flex-shrink-0" />
                Doc ({chunk.document_id}) - Chunk ({chunk.id})
              </span>
              <span>Similarity: {chunk.similarity.toFixed(8)}</span>
            </div>
            <div className="text-sm line-clamp-6">{chunk.content}</div>
          </div>
        ))}
        {chunks.length === 0 && (
          <div className="flex items-center w-full h-full justify-center text-base-content/20 text-sm text-center">
            No test results
            <br />
            Try sending a test message
          </div>
        )}
      </div>
      <div className="p-1 border-t border-base-content/20 flex items-center gap-1">
        <input
          className="w-full bg-transparent text-sm"
          placeholder={"Enter test message"}
          value={query}
          autoFocus
          onKeyDown={handleKeyDown}
          onChange={(e: any) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSend}
          className={clsx("btn btn-sm btn-primary", {
            "btn-disabled": query === "",
          })}
        >
          {isTesting ? <div className="loading loading-xs" /> : "Send"}
        </button>
      </div>
    </div>
  );
};

export default RetrieveTestPane;
