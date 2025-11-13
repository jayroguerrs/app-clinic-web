export interface Promotion {
  id: number;
}

export interface PriceBlock {
  columName: string;
  price: number;
}

export interface PromotionDetail {
  idPromotion: number;
  idGender: number;
  price: number;
  zone: string;
  priceBlocks: PriceBlock[] | null
}

export interface PromotionTemplate {
  idPromotionPrice: number;
  idPromotionZone: number;
  idPromotionBlock: number;
  price: number;
  template: string;
  descriptionBlock: string;
}
