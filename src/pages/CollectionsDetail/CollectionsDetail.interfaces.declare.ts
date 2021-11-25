export interface CollectionsDetailSearchProps {
    max_price: string;
    min_price: string;
    select_class: string;
    select_group: string;
    select_order: string;
    token_id: string;
    contract_id: number | string | null;
}

export interface CollectionsDetailContractInfoProps {
    list: any;
    total: any;
}
