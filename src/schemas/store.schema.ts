import { number, object, string, TypeOf } from 'zod';


const body = {
  body: object({
    brand: string({
      required_error: 'Brand name is required',
    }),
    category: string({
      required_error: 'Category is required',
    }),
    year: number({
      required_error: 'Price is required',
    }).min(1900, "Please provide a valid year.").positive("Minus Year . Are you out of a mind?"),
  }),
}

const createParams = {
  params: object({
    marketId: string({
      required_error: "marketId is required",
    }),
  }),
};

const params = {
  params: object({
    storeId: string(),
  }),
};


export const createStoreSchema = object({
  ...body,
  ...createParams
});

export const updateStoreSchema = object({
  ...body,
  ...params,
});

export const deleteStoreSchema = object({
  ...params,
});

export const getStoreSchema = object({
  ...params,
});

export const listStoreSchema = object({
  ...createParams,
});

export type CreateStoreInput = TypeOf<typeof createStoreSchema>;
export type UpdateStoreInput = TypeOf<typeof updateStoreSchema>;
export type ReadStoreInput = TypeOf<typeof getStoreSchema>;
export type ListStoreInput = TypeOf<typeof listStoreSchema>;
export type DeleteStoreInput = TypeOf<typeof deleteStoreSchema>;
