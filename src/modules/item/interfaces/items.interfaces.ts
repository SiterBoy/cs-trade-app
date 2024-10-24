export interface BaseItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number;
  max_price: number;
  mean_price: number;
  quantity: number;
  created_at: number;
  updated_at: number;
}

export interface Item extends BaseItem {}

export interface CombinedItem extends Omit<BaseItem, 'min_price'> {
  min_tradable_price: number;
  min_not_tradable_price: number;
}