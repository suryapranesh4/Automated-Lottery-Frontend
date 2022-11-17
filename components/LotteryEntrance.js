import React from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddress } from "./../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = React.useState("0");
  const [numOfPlayers, setNumOfPlayers] = React.useState("0");
  const [recentWinner, setRecentWinner] = React.useState("0");

  const dispatch = useNotification();

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const fee = (await getEntranceFee()).toString();
    const players = (await getNumberOfPlayers()).toString();
    const winner = (await getRecentWinner()).toString();
    setEntranceFee(fee);
    setNumOfPlayers(players);
    setRecentWinner(winner);
  }

  React.useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = function (tx) {
    dispatch({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>
            Entrance fee :{ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number of Players: {numOfPlayers}</div>
          <div>Recent Winner : {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle address detected</div>
      )}
    </div>
  );
}
