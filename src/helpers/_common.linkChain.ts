import { envOwnerWalletAddress, envKlaytnAPIToken, envMintQ } from '@/includes/envVariables';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 태순님이 includes/envVariables.ts 에 적용하신 내용을 찾을 수 없어서
 * conflict 날까봐 여기다가 사용해야 할 것들만 모았습니다.
 * ForMoveFactory 란 기존 factory 에서 새로운 factory 로 갈아끼워야하는 factory address
 */
export const factoryAddress = window.envFactoryAddress;
export const forMoveFactoryAddress = window.envForMoveFactoryAddress;
export const PoPoContractAddress = window.envPOPOContractAddress;
export const fee = window.envMintRequestValue;

export const newPoPoFactoryAddress = window.envForMoveFactoryAddress;
export const oldPoPoFactoryAddress = window.envFactoryAddress;

console.log('factoryAddress : ', factoryAddress);
console.log('PoPoContractAddress : ', PoPoContractAddress);
console.log('fee : ', fee);

export const ownerWalletAddress = envOwnerWalletAddress;
export const klaytnAPIToken = envKlaytnAPIToken;
export const qNumber = envMintQ;
export const mintRequestValue = window.envMintRequestValue;
export const enNode = window.envEnNode;
export const myBAppName = process.env.REACT_APP_COMMONS_MY_BAPP_NAME;

export const isApprovalForAppABI = {
    constant: true,
    inputs: [
        {
            name: 'owner',
            type: 'address',
        },
        {
            name: 'operator',
            type: 'address',
        },
    ],
    name: 'isApprovedForAll',
    outputs: [
        {
            name: '',
            type: 'bool',
        },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
};
export const setApprovalForAllABI = {
    name: 'setApprovalForAll',
    type: 'function',
    inputs: [
        {
            type: 'address',
            name: 'to',
        },
        {
            type: 'bool',
            name: 'approved',
        },
    ],
};
export const mintNFTABI = {
    name: 'mintNFT',
    type: 'function',
    inputs: [
        {
            type: 'uint256',
            name: '_mintQ',
        },
    ],
};

export const mintNFTABI_TEST = {
    name: 'mintNFT',
    type: 'function',
    inputs: [
        {
            type: 'uint256',
            name: '_mintQ',
        },
        {
            type: 'uint256',
            name: '_mtlIdx',
        },
    ],
};

export const sellNFTABI = {
    name: 'sell',
    type: 'function',
    inputs: [
        {
            type: 'uint256',
            name: '_tokenId',
        },
        {
            type: 'uint256',
            name: '_sellPrice',
        },
    ],
};
export const sellCancelNFTABI = {
    name: 'sell_cancel',
    type: 'function',
    inputs: [
        {
            type: 'uint256',
            name: '_tokenId',
        },
    ],
};
export const sellingItemList = {
    constant: true,
    inputs: [
        {
            name: '_user',
            type: 'address',
        },
    ],
    name: 'user_selling_items',
    outputs: [
        {
            name: '',
            type: 'uint256[]',
        },
        {
            name: '',
            type: 'uint256[]',
        },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
};
export const buyNFTABI = {
    name: 'buy',
    type: 'function',
    payable: true,
    inputs: [
        {
            type: 'uint256',
            name: '_tokenId',
        },
    ],
};

export const factoryABI = [
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'buy',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_tokenId',
                type: 'uint256',
            },
            {
                name: '_uri',
                type: 'string',
            },
        ],
        name: 'mint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_mintQ',
                type: 'uint256',
            },
        ],
        name: 'mintNFT',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'release',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
            {
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'sell',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'sell_cancel',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_address',
                type: 'address',
            },
        ],
        name: 'setKlayMintAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_maxMint',
                type: 'uint256',
            },
        ],
        name: 'setMaxMint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_mintCount',
                type: 'uint256',
            },
        ],
        name: 'setMintCount',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_price',
                type: 'uint256',
            },
        ],
        name: 'setMintPrice',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_mintQ',
                type: 'uint256',
            },
        ],
        name: 'setMintQ',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_time',
                type: 'uint256',
            },
        ],
        name: 'setMintTimeStamp',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_address',
                type: 'address',
            },
        ],
        name: 'setNFTProjectAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_klaymint',
                type: 'uint256',
            },
            {
                name: '_project',
                type: 'uint256',
            },
        ],
        name: 'setTradeFee',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_owner',
                type: 'address',
            },
            {
                indexed: true,
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'mintEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_owner',
                type: 'address',
            },
            {
                indexed: true,
                name: '_tokenId',
                type: 'uint256',
            },
            {
                indexed: true,
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'sellEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_seller',
                type: 'address',
            },
            {
                indexed: true,
                name: '_buyer',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'buyEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'sellCancelEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        constant: true,
        inputs: [],
        name: 'isOwner',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'maxMintCount',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'mintCount',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'mintPrice',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        name: 'sellings',
        outputs: [
            {
                name: 'owner',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        name: 'sellItems',
        outputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'sellPrice',
                type: 'uint256',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
            {
                name: 'isSelling',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'token_trade_history',
        outputs: [
            {
                name: '',
                type: 'uint256[]',
            },
            {
                name: '',
                type: 'address[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_user',
                type: 'address',
            },
        ],
        name: 'user_selling_items',
        outputs: [
            {
                name: '',
                type: 'uint256[]',
            },
            {
                name: '',
                type: 'uint256[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'ViewState',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'address',
            },
            {
                name: '',
                type: 'address',
            },
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
export const kip17ABI = [
    {
        constant: true,
        inputs: [
            {
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getApproved',
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'from',
                type: 'address',
            },
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'unpause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'mint',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'from',
                type: 'address',
            },
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'isPauser',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'tokenByIndex',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
            {
                name: 'tokenURI',
                type: 'string',
            },
        ],
        name: 'mintWithTokenURI',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'paused',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ownerOf',
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renouncePauser',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'addPauser',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'pause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'isOwner',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'addMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'isMinter',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'from',
                type: 'address',
            },
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
            {
                name: '_data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'tokenURI',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'isApprovedForAll',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'symbol',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'PauserAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'PauserRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'MinterAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'MinterRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'approved',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'ApprovalForAll',
        type: 'event',
    },
];

export const last_mintNFT_ABI = {
    constant: false,
    inputs: [
        {
            name: '_roundNumber',
            type: 'uint256',
        },
        {
            name: '_mintQ',
            type: 'uint256',
        },
    ],
    name: 'mintNFT',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
};

export const ccc_factoryABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'addOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'admin_sell_cancel',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'buy',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_tokenId',
                type: 'uint256',
            },
            {
                name: '_uri',
                type: 'string',
            },
        ],
        name: 'mint',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'mint_release',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_roundNumber',
                type: 'uint256',
            },
            {
                name: '_mintQ',
                type: 'uint256',
            },
        ],
        name: 'mintNFT',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'release',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
            {
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'sell',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'sell_cancel',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_address',
                type: 'address',
            },
        ],
        name: 'set_deposit_wallet',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_address',
                type: 'address',
            },
        ],
        name: 'setKlayMintAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_mintFeePercent',
                type: 'uint256',
            },
        ],
        name: 'setMintFee',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_address',
                type: 'address',
            },
        ],
        name: 'setNFTProjectAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_roundNumber',
                type: 'uint256',
            },
            {
                name: '_startTimeStamp',
                type: 'uint256',
            },
            {
                name: '_endTimeStamp',
                type: 'uint256',
            },
            {
                name: '_mintPrice',
                type: 'uint256',
            },
            {
                name: '_mintQ',
                type: 'uint256',
            },
            {
                name: '_mintStart_id',
                type: 'uint256',
            },
            {
                name: '_mintEnd_id',
                type: 'uint256',
            },
        ],
        name: 'setRound',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_klaymint',
                type: 'uint256',
            },
            {
                name: '_project',
                type: 'uint256',
            },
        ],
        name: 'setTradeFee',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_owner',
                type: 'address',
            },
            {
                indexed: true,
                name: '_tokenId',
                type: 'uint256',
            },
            {
                indexed: true,
                name: '_mtlIdx',
                type: 'uint256',
            },
        ],
        name: 'mintEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_owner',
                type: 'address',
            },
            {
                indexed: true,
                name: '_tokenId',
                type: 'uint256',
            },
            {
                indexed: true,
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'sellEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_seller',
                type: 'address',
            },
            {
                indexed: true,
                name: '_buyer',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                name: '_sellPrice',
                type: 'uint256',
            },
        ],
        name: 'buyEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'sellCancelEvent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnerAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnerRemoved',
        type: 'event',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'account',
                type: 'address',
            },
        ],
        name: 'isOwner',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'mintFeePercent',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        name: 'rounds',
        outputs: [
            {
                name: 'round',
                type: 'uint256',
            },
            {
                name: 'startTimeStamp',
                type: 'uint256',
            },
            {
                name: 'endTimeStamp',
                type: 'uint256',
            },
            {
                name: 'mintPrice',
                type: 'uint256',
            },
            {
                name: 'mintQ',
                type: 'uint256',
            },
            {
                name: 'mintStart_id',
                type: 'uint256',
            },
            {
                name: 'mintEnd_id',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        name: 'sellings',
        outputs: [
            {
                name: 'owner',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        name: 'sellItems',
        outputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'sellPrice',
                type: 'uint256',
            },
            {
                name: 'tokenId',
                type: 'uint256',
            },
            {
                name: 'isSelling',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'token_trade_history',
        outputs: [
            {
                name: '',
                type: 'uint256[]',
            },
            {
                name: '',
                type: 'address[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_user',
                type: 'address',
            },
        ],
        name: 'user_selling_items',
        outputs: [
            {
                name: '',
                type: 'uint256[]',
            },
            {
                name: '',
                type: 'uint256[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];
