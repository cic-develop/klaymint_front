import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * secondBackHost : listen 전용 instance
 * secondBackHost2 : api.klaymint의 서브 api instance 또는 countDown 따위의 지속적으로 많은 양의 api 요청을 해야하는 경우 사용하는 instance server
 */
const secondBackHost = process.env.REACT_APP_PRODUCTION_BACKEND_HOST_ISSUANCE;
const secondBackHost2 = process.env.REACT_APP_PRODUCTION_BACKEND_HOST_ISSUANCE2;

export const getViewList = async () => {
    try {
        return await axios.get(`${window.envBackHost}/market/viewList?brand=PoPo`);
    } catch (error) {
        return await axios.get(`${secondBackHost2}/market/viewList?brand=PoPo`);
    }
};

export const getViewListJson = async (brandName) => {
    try {
        return await axios.get(`${window.envBackHost}/market/viewList/json?brand=${brandName}`);
    } catch (e) {
        return await axios.get(`${secondBackHost2}/market/viewList/json?brand=${brandName}`);
    }
};

export const getView = async (data) => {
    try {
        return await axios.post(`${window.envBackHost}/market/view`, data, { responseType: 'arraybuffer' });
    } catch (e) {
        return await axios.post(`${secondBackHost2}/market/view`, data, { responseType: 'arraybuffer' });
    }
};

export const getSalesList = async () => {
    try {
        return await axios.get(`${window.envBackHost}/market/salesList`);
    } catch (e) {
        return await axios.get(`${secondBackHost2}/market/salesList`);
    }
};

export const getMySalesList = async (address) => {
    try {
        return await axios.get(`${window.envBackHost}/market/salesList/owner?owner=${address}`);
    } catch (e) {
        return await axios.get(`${secondBackHost2}/market/salesList/owner?owner=${address}`);
    }
};

export const getLimitSalesList = async (data) => {
    try {
        return await axios.post(`${window.envBackHost}/market/salesList/limit`, data);
    } catch (e) {
        return await axios.post(`${secondBackHost2}/market/salesList/limit`, data);
    }
};

export const getOneDaySalesHistory = async (brandName, daysAgo) => {
    try {
        if (daysAgo)
            return await axios.get(
                `${window.envBackHost}/market/salesHistory?brandName=${brandName}&daysAgo=${daysAgo}&limit=50`,
            );
        return await axios.get(`${window.envBackHost}/market/salesHistory?brandName=${brandName}&limit=50`);
    } catch (e) {
        if (daysAgo)
            return await axios.get(
                `${secondBackHost2}/market/salesHistory?brandName=${brandName}&daysAgo=${daysAgo}&limit=50`,
            );
        return await axios.get(`${secondBackHost2}/market/salesHistory?brandName=${brandName}&limit=50`);
    }
};

export const getSalesHistory = async (brandName, tokenId?) => {
    try {
        if (tokenId)
            return await axios.get(
                `${window.envBackHost}/market/salesHistory?brandName=${brandName}&tokenId=${tokenId}`,
            );
        return await axios.get(`${window.envBackHost}/market/salesHistory?brandName=${brandName}`);
    } catch (e) {
        if (tokenId)
            return await axios.get(`${secondBackHost2}/market/salesHistory?brandName=${brandName}&tokenId=${tokenId}`);
        return await axios.get(`${secondBackHost2}/market/salesHistory?brandName=${brandName}`);
    }
};

export const getKlayFromAddress = async (address) => {
    try {
        return await axios.post(`${window.envBackHost}/en/balance`, { address });
    } catch (e) {
        return await axios.post(`${secondBackHost2}/en/balance`, { address });
    }
};

export const getPebFromKlay = async (balance) => {
    try {
        return await axios.post(`${window.envBackHost}/en/balance/convertFromPeb`, { balance });
    } catch (e) {
        return await axios.post(`${secondBackHost2}/en/balance/convertFromPeb`, { balance });
    }
};

export const getIsOwner = async (token_id, contractAddress) => {
    try {
        return await axios.post(`${window.envBackHost}/en/isOwner`, { token_id, contractAddress });
    } catch (e) {
        return await axios.post(`${secondBackHost2}/en/isOwner`, { token_id, contractAddress });
    }
};

export const getIsApproved = async (address, contractAddress, factoryAddress) => {
    try {
        return await axios.post(`${window.envBackHost}/en/isApproved`, { address, contractAddress, factoryAddress });
    } catch (e) {
        return await axios.post(`${secondBackHost2}/en/isApproved`, { address, contractAddress, factoryAddress });
    }
};

export const getRoundAmount = async () => {
    try {
        return await axios.post(`${window.envBackHost}/minting`);
    } catch (e) {
        return await axios.post(`${window.envBackHost}/minting`);
    }
};

export const getCount = async (mtl_idxs = []) => {
    try {
        return await axios.post(`${window.envBackHost}/minting/count`, { mtl_idx: mtl_idxs });
    } catch (e) {
        return await axios.post(`${window.envBackHost}/minting/count`, { mtl_idx: mtl_idxs });
    }
};

export const getContracts = async () => {
    try {
        return await axios.post(`${window.envBackHost}/contracts`);
    } catch (e) {
        return await axios.post(`${window.envBackHost}/contracts`);
    }
};

export const postContractInfo = async (data) => {
    try {
        return await axios.post(`${window.envBackHost}/contracts/names`, data);
    } catch (e) {
        return await axios.post(`${window.envBackHost}/contracts/names`, data);
    }
};

export const getContractInfo = async () => {
    try {
        return await axios.get(`${window.envBackHost}/contracts/names`);
    } catch (e) {
        return await axios.get(`${window.envBackHost}/contracts/names`);
    }
};

export const getIsClassColor = async (contractListId) => {
    try {
        return await axios.post(`${window.envBackHost}/market/isClass`, { contractListId });
    } catch (e) {
        return await axios.post(`${window.envBackHost}/market/isClass`, { contractListId });
    }
};

export const getTradeChart = async (contract_id) => {
    try {
        return await axios.post(`${window.envBackHost}/contracts/chart`, { contract_id: contract_id });
    } catch (e) {
        return await axios.post(`${window.envBackHost}/contracts/chart`, { contract_id: contract_id });
    }
};

export const getClassByFloorPrice = async (contract_id) => {
    try {
        return await axios.post(`${window.envBackHost}/market/floorprices`, { ctl_idx: contract_id });
    } catch (e) {
        return await axios.post(`${window.envBackHost}/market/floorprices`, { ctl_idx: contract_id });
    }
};

export const getServerInfo = async () => {
    try {
        return await axios.post(`${window.envBackHost}/main/info`);
    } catch (e) {
        return await axios.post(`${window.envBackHost}/main/info`);
    }
};
