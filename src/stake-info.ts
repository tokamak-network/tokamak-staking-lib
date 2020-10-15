import Web3 from "web3";
import { provider } from "web3-core";
import { BN } from "../node_modules/bn.js"; // This relative path is used to specify 'bn.js', not '@types/bn.js'.
const { toBN } = require("web3-utils");
import Web3Connector from "./common/web3-connector";
import Layer2Registry from "./contracts/layer2-registry";
import SeigManager from "./contracts/seig-manager";

export const setNetwork = (provider: provider, net: string = "mainnet") => {
    Web3Connector.setNetwork(provider);
    Layer2Registry.setNetwork(net);
    SeigManager.setNetwork(net);
};

export const getNumLayer2 = (): Promise<string> => {
    return Layer2Registry.instance().numLayer2s();
};

export const getLayer2ByIndex = (index: number): Promise<string> => {
    return Layer2Registry.instance().layer2ByIndex(index);
};

export const isLayer2 = (layer2: string): Promise<boolean> => {
    return Layer2Registry.instance().layer2s(layer2);
};

export const getStakedAmount = (layer2: string, account: string): Promise<string> => {
    return SeigManager.instance().stakeOf(layer2, account);
};

export const getTotalStakedAmount = async (account: string): Promise<string> => {
    let total: BN = new BN(0);
    const num: number = Number(await getNumLayer2());
    for (let i: number = 0; i < num; ++i) {
        const layer2: string = await getLayer2ByIndex(i);
        const amount: string = await getStakedAmount(layer2, account);
        total = total.add(toBN(amount));
    }

    return total.toString();
};
