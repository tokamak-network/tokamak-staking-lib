import { provider } from "web3-core";
import BN from "bn.js";
import Web3Connector from "./common/web3-connector";
import Layer2Registry from "./contracts/layer2-registry";
import SeigManager from "./contracts/seig-manager";
import Layer2s from "./contracts/layer2s";
const PrivatekeyProvider = require("truffle-privatekey-provider");

export const setNetwork = (provider: provider, net: string = "mainnet") => {
    Web3Connector.setNetwork(provider);
    Layer2Registry.setNetwork(net);
    SeigManager.setNetwork(net);
};

export const getNumLayer2 = (): Promise<number> => {
    return Layer2Registry.instance().numLayer2s();
};

export const getLayer2ByIndex = (index: number): Promise<string> => {
    return Layer2Registry.instance().layer2ByIndex(index);
};

export const isLayer2 = (layer2: string): Promise<boolean> => {
    return Layer2Registry.instance().layer2s(layer2);
};

export const getStakedAmount = async (layer2: string, account: string, blockNumber?: BN): Promise<BN> => {
    return SeigManager.instance().stakeOf(layer2, account, blockNumber);
};

export const getStakedAmountDiff = async (layer2: string, account: string, fromBlockNumber: BN, toBlockNumber?: BN): Promise<BN> => {
    const fromAmount: BN = await SeigManager.instance().stakeOf(layer2, account, fromBlockNumber);
    const toAmount: BN = await SeigManager.instance().stakeOf(layer2, account, toBlockNumber);
    return toAmount.sub(fromAmount);
};

export const getTotalStakedAmount = async (account: string, blockNumber?: BN): Promise<BN> => {
    let total: BN = new BN(0);
    const num: number = await getNumLayer2();
    for (let i: number = 0; i < num; ++i) {
        const layer2: string = await getLayer2ByIndex(i);
        const amount: BN = await getStakedAmount(layer2, account, blockNumber);
        total = total.add(amount);
    }

    return total;
};

export const getTotalStakedAmountDiff = async (account: string, fromBlockNumber: BN, toBlockNumber?: BN): Promise<BN> => {
    let total: BN = new BN(0);
    const num: number = await getNumLayer2();
    for (let i: number = 0; i < num; ++i) {
        const layer2: string = await getLayer2ByIndex(i);
        const diff: BN = await getStakedAmountDiff(layer2, account, fromBlockNumber, toBlockNumber);
        total = total.add(diff);
    }

    return total;
};

export const getOperator = (layer2: string): Promise<string> => {
    return Layer2s.get(layer2).operator();
};

export const isSubmitter = (layer2: string, account: string): Promise<boolean> => {
    return Layer2s.get(layer2).isSubmitter(account);
};
