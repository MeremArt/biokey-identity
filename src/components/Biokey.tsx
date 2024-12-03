// TODO: createAccount
import { verify } from "@noble/ed25519";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import bs58 from "bs58";
import { FC, useCallback, useState } from "react";
import idl from "./biokey.json";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  setProvider,
} from "@coral-xyz/anchor";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { Biokey } from "./biokey";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

const idl_string = JSON.stringify(idl);

const idl_object = JSON.parse(idl_string);
const programId = new PublicKey(idl.address);

export const BiokeyV: FC = () => {
  const { connection } = useConnection();
  const [fingerprint, setFingerprint] = useState<Uint8Array | null>(null);

  const wallet = useWallet();

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    setProvider(provider);
    return provider;
  };
  const fingerprintToHex = (fp: Uint8Array): string => {
    return Array.from(fp)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const createUserAccount = async () => {
    try {
      const anchorProvider = getProvider();
      const program = new Program<Biokey>(idl_object, anchorProvider);

      // Generate 32-byte array of random values

      const hashedFingerprint = new Uint8Array(32);
      crypto.getRandomValues(hashedFingerprint);

      // Convert Uint8Array to array of numbers
      const fingerprintArray = Array.from(hashedFingerprint);

      const user = anchorProvider.publicKey;

      // Derive the PDA for the user account

      // Call the createUserAccount method
      await program.methods
        .createUserAccount(Array.from(hashedFingerprint))
        .accounts({
          user,
        })
        .rpc();
      // Store the generated fingerprint for potential validation
      setFingerprint(hashedFingerprint);
      toast.success("User account created successfully");
      console.log("User account created successfully");
    } catch (error) {
      console.error("Error creating user account:", error);
      toast.error(String(error));
    }
  };

  const validateFingerprint = async () => {
    if (!fingerprint) {
      toast.error("No fingerprint generated. Create an account first.");
      return;
    }

    try {
      const anchorProvider = getProvider();
      const program = new Program<Biokey>(idl_object, anchorProvider);

      // Derive the PDA for the user account

      const [userAccount] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user"), anchorProvider.publicKey.toBuffer()],
        program.programId
      );

      // Check if the user account PDA exists
      const userAccountInfo = await connection.getAccountInfo(userAccount);
      if (!userAccountInfo) {
        toast.error("User account does not exist. Please create one first.");
        return;
      }

      // Convert fingerprint to an array of numbers
      const fingerprintArray = Array.from(fingerprint);
      const user = anchorProvider.publicKey;
      // Call the validate_fingerprint method
      const isValid = await program.methods
        .validateFingerprint(fingerprintArray)
        .accounts({
          user,
        })
        .rpc();

      if (isValid) {
        toast.success("Fingerprint validation successful!");
      } else {
        toast.error("Fingerprint validation failed.");
      }
    } catch (error) {
      console.error("Error validating fingerprint:", error);
      toast.error(String(error));
    }
  };

  const fetchfingerprint = async () => {
    try {
      const anchorProvider = getProvider();
      const program = new Program<Biokey>(idl_object, anchorProvider);

      // Derive the PDA for the user account
      const [userAccount] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user"), anchorProvider.publicKey.toBuffer()],
        program.programId
      );

      // Check if the user account PDA exists
      const userAccountInfo = await connection.getAccountInfo(userAccount);
      if (!userAccountInfo) {
        toast.error("User account does not exist. Please create one first.");
        return;
      }

      // Call the fetchUserFingerprint method
      const fetchedFingerprint: any = await program.methods
        .fetchUserFingerprint()
        .accounts({
          user: anchorProvider.publicKey,
        })
        .rpc(); // Use rpcAndParse() instead of rpc()

      // Convert the fetched fingerprint to a Uint8Array

      setFingerprint(fetchedFingerprint);
      toast.success("Fingerprint fetched successfully!");
      console.log("Fetched Fingerprint:", fetchedFingerprint);
    } catch (error) {
      console.error("Error fetching fingerprint:", error);
      toast.error(String(error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-row justify-center space-x-4">
        <div className="relative group items-center">
          <div
            className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                  rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={createUserAccount}
            disabled={!wallet.publicKey}
          >
            <div className="hidden group-disabled:block">
              Wallet not connected
            </div>
            <span className="block group-disabled:hidden">Create Account</span>
          </button>
        </div>

        <div className="relative group items-center">
          <div
            className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                  rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={validateFingerprint}
            disabled={!wallet.publicKey}
          >
            <div className="hidden group-disabled:block">
              Wallet not connected
            </div>
            <span className="block group-disabled:hidden">
              Validate Fingerprint
            </span>
          </button>
        </div>

        <div className="relative group items-center">
          <div
            className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                  rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={fetchfingerprint}
            disabled={!wallet.publicKey}
          >
            <div className="hidden group-disabled:block">
              Wallet not connected
            </div>
            <span className="block group-disabled:hidden">
              Fetch Fingerprint
            </span>
          </button>
        </div>
      </div>

      {/* Fingerprint Display Section */}
      {fingerprint && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl text-black font-semibold mb-2 text-center">
            Current Fingerprint
          </h2>
          <div className="flex items-center justify-center">
            <div className="bg-white text-black p-4 rounded-lg shadow-inner">
              <div className="font-mono text-sm break-all max-w-xl">
                {fingerprintToHex(fingerprint)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            Length: {fingerprint.length} bytes
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};
