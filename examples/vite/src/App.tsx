import { LiFiWidget } from "@lifi/widget";

function App() {
  return (
    <LiFiWidget
      config={{
        containerStyle: {
          width: 392,
          height: 640,
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: "16px",
          display: "flex",
          maxWidth: 392,
        },
      }}
    />
  );
}

export default App;
