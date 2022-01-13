import { object,string,number, TypeOf } from "zod";


const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    price: number({
      required_error: "Price is required",
    }),
    location: string({
      required_error: "Location is required",
    }),
  }),
};

const params = {
  params: object({
    marketId: string({
      required_error: "marketId is required",
    }),
  }),
};

export const createMarketSchema = object({
  ...payload,
});

export const updateMarketSchema = object({
  ...payload,
  ...params,
});

export const deleteMarketSchema = object({
  ...params,
});

export const getMarketSchema = object({
  ...params,
});



export type CreateMarketInput = TypeOf<typeof createMarketSchema>;
export type UpdateMarketInput = TypeOf<typeof updateMarketSchema>;
export type ReadMarketInput = TypeOf<typeof getMarketSchema>;
export type DeleteMarketInput = TypeOf<typeof deleteMarketSchema>;