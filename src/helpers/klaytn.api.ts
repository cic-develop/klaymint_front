import axios from 'axios';
import {
    klaytnAPIToken,
    factoryAddress,
    PoPoContractAddress,
    forMoveFactoryAddress,
} from '@/helpers/_common.linkChain';

import dotenv from 'dotenv';
dotenv.config();

const baseURL = 'https://th-api.klaytnapi.com/v2';

const contractAddresses: string[] = [
    '0x0Ed55aEe0399064Cfe51dD3cC10D99734bb796c7', // PoPo
    '0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae', // dsc
    '0x3b0a9c4cfa6dd8a2cbecb1e0ad9a35336970afdf', // jo
    '0xc904e0ab77139f65c78b192bcf7266da85cc3343', // rabbit
    '0x590744cb8cf1a698d7db509b52bf209e3cccb8e0', // animal
    '0x6db38a2f363c5886c4e66ce0d38e031160fd0a09', // rock
    '0x86b0f3dfddadb2e57b00a6d740f1a464f79179bf', // ape
    '0x4AaF8FC3eef63c082A0a47B39F029cA89a0c2c34', // ccc
];

export const getMyTokens_in_kaikas = async (walletAddress: string, address, cursor?) => {
    const contractAddress = address.map((item) => item.contract_address);

    if (cursor) {
        return await axios.get(
            `${baseURL}/account/${walletAddress}/token?kind=nft&ca-filters=${contractAddress}&size=1000&cursor=${cursor}`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    } else {
        return await axios.get(
            `${baseURL}/account/${walletAddress}/token?kind=nft&ca-filters=${contractAddress}&size=1000`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    }
};

export const getAllToken_in_factory = async (factoryAddress, contractAddress, cursor?) => {
    if (cursor) {
        return await axios.get(
            `${baseURL}/account/${factoryAddress}/token?kind=nft&ca-filters=${contractAddress}&size=1000&cursor=${cursor}`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    } else {
        return await axios.get(
            `${baseURL}/account/${factoryAddress}/token?kind=nft&ca-filters=${contractAddress}&size=1000`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    }
};

export const getAllToken_in_for_move_factory = async (cursor?) => {
    if (cursor) {
        return await axios.get(
            `${baseURL}/account/${forMoveFactoryAddress}/token?kind=nft&ca-filters=${contractAddresses.join(
                ',',
            )}&size=1000&cursor=${cursor}`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    } else {
        return await axios.get(
            `${baseURL}/account/${forMoveFactoryAddress}/token?kind=nft&ca-filters=${contractAddresses.join(
                ',',
            )}&size=1000`,
            {
                headers: {
                    'X-Chain-Id': '8217',
                    'Authorization': klaytnAPIToken,
                },
            },
        );
    }
};

export const getAllList = async (cursor?) => {
    if (cursor) {
        return axios.get(`${baseURL}/contract/nft/${PoPoContractAddress}/token?size=1000&cursor=${cursor}`, {
            headers: {
                'X-Chain-Id': '8217',
                'Authorization': klaytnAPIToken,
            },
        });
    }
    return await axios.get(`${baseURL}/contract/nft/${PoPoContractAddress}/token?size=1000`, {
        headers: {
            'X-Chain-Id': '8217',
            'Authorization': klaytnAPIToken,
        },
    });
};
