import { useMoralis } from "react-moralis";
import React from "react";

function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } =
    useMoralis();

  React.useEffect(() => {
    if (isWeb3Enabled) return;
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      window.localStorage.setItem("connected", "injected");
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  React.useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("Account changed to ", account);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>
          <p>Connected to {account}</p>
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
          }}
        >
          {" "}
          Connect
        </button>
      )}
    </div>
  );
}

export default ManualHeader;
