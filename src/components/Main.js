import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/abi.json";

export default function Main() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [input, setInput] = useState("");
  const [res, setRes] = useState("placeholder");
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const signer = await provider.getSigner();
      setSigner(signer);

      //TODO REPLACE ADDRESS WITH DEPLOYED ADDRESS
      const contract = new ethers.Contract(
        "0xbb775bd464a5a37d8c67b0dccc52b9848a991ddd",
        abi,
        signer
      );
      setContract(contract);
    }
  };

  const getBlockNumber = async () => {
    const blockNumber = await provider.getBlockNumber();
    setBlockNumber(blockNumber);
  };

  const contractGet = async () => {
    const value = await contract.get();
    setRes(value);
  };

  const contractSet = async () => {
    await contract.set(input);
  };

  const inputHandler = (event) => {
    setInput(event.target.value);
  };

  // useEffect(() => {
  //   const init = async () => {
  //     if (window.ethereum) {
  //       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       setProvider(provider);
  //       const signer = await provider.getSigner();
  //       setSigner(signer);

  //       //TODO REPLACE ADDRESS WITH DEPLOYED ADDRESS
  //       const contract = new ethers.Contract(
  //         "0xbb775bd464a5a37d8c67b0dccc52b9848a991ddd",
  //         abi,
  //         signer
  //       );
  //       setContract(contract);
  //     }
  //   };
  //   init();
  // }, []);
  return (
    <div className="flex flex-col items-center w-screen">
      <button
        className="rounded-full bg-slate-800 text-white p-4 m-2"
        onClick={connectWallet}
      >
        {walletAddress ? walletAddress : "Connect Wallet"}
      </button>
      <div className="flex flex-col items-center">
        <button
          className="rounded-full bg-slate-800 text-white p-4 m-2"
          onClick={getBlockNumber}
        >
          Get Block Number
        </button>
        <div>{blockNumber}</div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="rounded-full bg-slate-800 text-white p-4 m-2"
          onClick={contractGet}
        >
          GET FROM CONTRACT
        </button>
        <div>{res}</div>
      </div>
      <input className="block bg-white border border-slate-300 rounded-md p-4 m-2" value={input} onChange={inputHandler} />
      <button
        className="rounded-full bg-slate-800 text-white p-4 m-2"
        onClick={contractSet}
      >
        SET FROM CONTRACT
      </button>
    </div>
  );
}
