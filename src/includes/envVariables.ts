const isDev = process.env.NODE_ENV === 'development';

/**
 * Switching .env Define Values
 */

export const envFrontHost = isDev
    ? process.env.REACT_APP_DEVELOPMENT_FRONTEND_HOST
    : process.env.REACT_APP_PRODUCTION_FRONTEND_HOST;

export const envBackImageHost = isDev
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_IMAGE_HOST
    : process.env.REACT_APP_PRODUCTION_BACKEND_IMAGE_HOST;

export const envBackWebSocketHost = isDev
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_WEB_SOCKET_HOST
    : process.env.REACT_APP_PRODUCTION_BACKEND_WEB_SOCKET_HOST;

export const envBackHost = isDev
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_HOST
    : process.env.REACT_APP_PRODUCTION_BACKEND_HOST;

export const envBackHost1 = isDev
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_HOST1
    : process.env.REACT_APP_PRODUCTION_BACKEND_HOST1;

export const envBackHost2 = isDev
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_HOST2
    : process.env.REACT_APP_PRODUCTION_BACKEND_HOST2;

export const envBAppName = isDev
    ? process.env.REACT_APP_DEVELOPMENT_MY_BAPP_NAME
    : process.env.REACT_APP_PRODUCTION_MY_BAPP_NAME;

export const envOwnerWalletAddress = isDev
    ? process.env.REACT_APP_DEVELOPMENT_OWNER_WALLET_ADDRESS
    : process.env.REACT_APP_PRODUCTION_OWNER_WALLET_ADDRESS;

export const envFactoryAddress = isDev
    ? process.env.REACT_APP_DEVELOPMENT_FACTORY_ADDRESS
    : process.env.REACT_APP_PRODUCTION_FACTORY_ADDRESS;

export const envForMoveFactoryAddress = isDev
    ? process.env.REACT_APP_DEVELOPMENT_FOR_MOVE_FACTORY_ADDRESS
    : process.env.REACT_APP_PRODUCTION_FOR_MOVE_FACTORY_ADDRESS;

export const envPOPOContractAddress = isDev
    ? process.env.REACT_APP_DEVELOPMENT_POPO_CONTRACT_ADDRESS
    : process.env.REACT_APP_PRODUCTION_POPO_CONTRACT_ADDRESS;

export const envKlaytnAPIToken = isDev
    ? process.env.REACT_APP_DEVELOPMENT_KLAYTN_API_TOKEN
    : process.env.REACT_APP_PRODUCTION_KLAYTN_API_TOKEN;

export const envMintQ = isDev ? process.env.REACT_APP_DEVELOPMENT_MINT_Q : process.env.REACT_APP_PRODUCTION_MINT_Q;

export const envMintRequestValue = isDev
    ? process.env.REACT_APP_DEVELOPMENT_MINT_REQUEST_VALUE
    : process.env.REACT_APP_PRODUCTION_MINT_REQUEST_VALUE;

export const envEnNode = isDev ? process.env.REACT_APP_DEVELOPMENT_EN_NODE : process.env.REACT_APP_PRODUCTION_EN_NODE;

/**
 * define Types
 */
declare global {
    interface Window {
        envFrontHost?: typeof envFrontHost;
        envBackImageHost?: typeof envBackImageHost;
        envBackWebSocketHost?: typeof envBackWebSocketHost;
        envBackHost?: typeof envBackHost;
        envBackHost1?: typeof envBackHost1;
        envBackHost2?: typeof envBackHost2;
        envBAppName?: typeof envBAppName;
        envFactoryAddress?: typeof envFactoryAddress;
        envForMoveFactoryAddress?: typeof envForMoveFactoryAddress;
        envPOPOContractAddress?: typeof envPOPOContractAddress;
        envMintRequestValue?: typeof envMintRequestValue;
        // envOwnerWalletAddress?: typeof envOwnerWalletAddress;
        // envKlaytnAPIToken?: typeof envKlaytnAPIToken;
        // envMintQ?: typeof envMintQ;
        envEnNode?: typeof envEnNode;
    }
}

/**
 * Add window object
 */
window.envFrontHost = envFrontHost;
window.envBackImageHost = envBackImageHost;
window.envBackWebSocketHost = envBackWebSocketHost;
window.envBackHost = envBackHost;
window.envBackHost1 = envBackHost1;
window.envBackHost2 = envBackHost2;
window.envBAppName = envBAppName;
window.envFactoryAddress = envFactoryAddress;
window.envForMoveFactoryAddress = envForMoveFactoryAddress;
window.envPOPOContractAddress = envPOPOContractAddress;
window.envMintRequestValue = envMintRequestValue;
// window.envOwnerWalletAddress = envOwnerWalletAddress;
// window.envKlaytnAPIToken = envKlaytnAPIToken;
// window.envMintQ = envMintQ;
window.envEnNode = envEnNode;

/**
 * env 확인용 print 콘솔 **************************************
 */
console.log('load Define Variable :', process.env.NODE_ENV, {
    'window FrontHost': window.envFrontHost,
    'window envBackImageHost': window.envBackImageHost,
    'window envBackWebSocketHost': window.envBackWebSocketHost,
    'window BackHost': window.envBackHost,
    'window BackHost1': window.envBackHost1,
    'window BackHost2': window.envBackHost2,
    'window BAppName': window.envBAppName,
    'window EnNode': window.envEnNode,
    'window FactoryAddress': window.envFactoryAddress,
    'window envForMoveFactoryAddress': window.envForMoveFactoryAddress,
    'window POPOContractAddress': window.envPOPOContractAddress,
    'window MintRequestValue': window.envMintRequestValue,

    '.env OwnerWalletAddress': envOwnerWalletAddress,
    '.env KlaytnAPIToken': envKlaytnAPIToken,
    '.env MintQ': envMintQ,
});
