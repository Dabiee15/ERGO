"use client"
import { useState, useCallback } from "react";

export default function IndexPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const openMonoWidget = useCallback(async () => {
    const MonoConnect = (await import("@mono.co/connect.js")).default;
    
    const monoInstance = new MonoConnect({
      key: "test_pk_i8y0hjauww9h0nm7z8fx",
      onClose: () => console.log("Widget closed"),
      onLoad: () => setScriptLoaded(true),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    });

    monoInstance.setup();
    monoInstance.open();
  }, []);

  return (
    <div>
      Hello World. Try Mono connect with next.js
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => openMonoWidget()}>
          Link a financial account
        </button>
      </div>
    </div>
  );
}