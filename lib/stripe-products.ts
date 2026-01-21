// Mapeo de productos locales a Stripe Price IDs
// Los precios están en centavos (32500 = $325.00 MXN)

export interface StripeProductMapping {
  localId: number
  stripePriceId: string
  stripeProductId: string
  name: string
  color: string
}

export const stripeProductMap: StripeProductMapping[] = [
  // Tenis Deportivos Low (productos 1-4)
  {
    localId: 1,
    stripePriceId: 'price_1Srp2w2Ncgfz5IICn4H8fHiv',
    stripeProductId: 'prod_TpU0No8suvCdsj',
    name: 'Tenis Deportivo Infantil ITALIA/CARAMEL',
    color: 'ITALIA/CARAMEL',
  },
  {
    localId: 2,
    stripePriceId: 'price_1Srp4i2Ncgfz5IIC8ZLlfBuq',
    stripeProductId: 'prod_TpU2F112E5zZK9',
    name: 'Tenis Deportivo Infantil ROSA B./ BLANCO',
    color: 'ROSA B./BLANCO',
  },
  {
    localId: 3,
    stripePriceId: 'price_1Srp692Ncgfz5IICG2Fm8MYv',
    stripeProductId: 'prod_TpU4ikwhdVK0D0',
    name: 'Tenis Deportivo Infantil OXFORD /PLATA',
    color: 'OXFORD/PLATA',
  },
  {
    localId: 4,
    stripePriceId: 'price_1Srp9w2Ncgfz5IICYSJ7uwfF',
    stripeProductId: 'prod_TpU8qC51oV4ZvQ',
    name: 'Tenis Deportivo Infantil BLANCO/ NEGRO',
    color: 'BLANCO/NEGRO',
  },
  // Tenis Deportivos High (productos 5-8, 14)
  {
    localId: 5,
    stripePriceId: 'price_1SrpBJ2Ncgfz5IICLTzx6jLx',
    stripeProductId: 'prod_TpU9o9lYgekM8M',
    name: 'Tenis Deportivo Alto Infantil BLANCO',
    color: 'BLANCO',
  },
  {
    localId: 6,
    stripePriceId: 'price_1SrpCN2Ncgfz5IICmeDsnYkj',
    stripeProductId: 'prod_TpUAbjq4bwH7Hu',
    name: 'Tenis Deportivo Alto Infantil CARAMEL',
    color: 'CARAMEL',
  },
  {
    localId: 7,
    stripePriceId: 'price_1SrpD02Ncgfz5IICkG3FprT0',
    stripeProductId: 'prod_TpUBACyd1x1jPg',
    name: 'Tenis Deportivo Alto Infantil MARINO',
    color: 'MARINO',
  },
  {
    localId: 8,
    stripePriceId: 'price_1SrpEo2Ncgfz5IICM7uAR9Bc',
    stripeProductId: 'prod_TpUDPIvICNdl4d',
    name: 'Tenis Deportivo Alto Infantil NEGRO',
    color: 'NEGRO',
  },
  {
    localId: 14,
    stripePriceId: 'price_1SrpFi2Ncgfz5IICzuYu4EL1',
    stripeProductId: 'prod_TpUEb5gcoX26YH',
    name: 'Tenis Deportivo Alto Infantil OXFORD',
    color: 'OXFORD',
  },
  // Colección Multicolor (producto 9)
  {
    localId: 9,
    stripePriceId: 'price_1SrpIc2Ncgfz5IICEgTtPcRn',
    stripeProductId: 'prod_TpUHxTTI57juOz',
    name: 'Tenis Deportivo Infantil MULTICOLOR',
    color: 'MULTICOLOR',
  },
  // Colección Ballerina (productos 10-13)
  {
    localId: 10,
    stripePriceId: 'price_1SrpMM2Ncgfz5IICCr4w64bx',
    stripeProductId: 'prod_TpULEfE37HlYjk',
    name: 'Tenis Balerina Infantil ROSA',
    color: 'ROSA',
  },
  {
    localId: 11,
    stripePriceId: 'price_1SrpNE2Ncgfz5IICwHxdvtJU',
    stripeProductId: 'prod_TpULmw0fv0F0FH',
    name: 'Tenis Ballerina Infantil NEGRO/BLANCO',
    color: 'NEGRO/BLANCO',
  },
  {
    localId: 12,
    stripePriceId: 'price_1SrpO02Ncgfz5IICbq3ul6FE',
    stripeProductId: 'prod_TpUMDLMNS9NBJX',
    name: 'Tenis Ballerina Infantil ROJO',
    color: 'ROJO',
  },
  {
    localId: 13,
    stripePriceId: 'price_1SrpPY2Ncgfz5IIC97HTEJiF',
    stripeProductId: 'prod_TpUOH1BPlMWJZY',
    name: 'Tenis Ballerina Infantil NEGRO',
    color: 'NEGRO',
  },
  // Colección Lightyear (productos 15-18)
  {
    localId: 15,
    stripePriceId: 'price_1SrpRc2Ncgfz5IIC60K0aI61',
    stripeProductId: 'prod_TpUQidiODeW5t8',
    name: 'Tenis Lightyear Infantil NEGRO/BLANCO',
    color: 'NEGRO/BLANCO',
  },
  {
    localId: 16,
    stripePriceId: 'price_1SrpSK2Ncgfz5IICiJzycGHv',
    stripeProductId: 'prod_TpURwZ2rHfyb9k',
    name: 'Tenis Lightyear Infantil V. BANDERA/BLANCO',
    color: 'V. BANDERA/BLANCO',
  },
  {
    localId: 17,
    stripePriceId: 'price_1SrpT12Ncgfz5IIC9xNajzBD',
    stripeProductId: 'prod_TpURKbj88V72vY',
    name: 'Tenis Lightyear Infantil AZUL/BLANCO',
    color: 'AZUL/BLANCO',
  },
  {
    localId: 18,
    stripePriceId: 'price_1SrpTf2Ncgfz5IICthx7xAO0',
    stripeProductId: 'prod_TpUSbkH46dKt5a',
    name: 'Tenis Lightyear Infantil ROSA/BLANCO',
    color: 'ROSA/BLANCO',
  },
]

export function getStripePriceId(localProductId: number): string | null {
  const mapping = stripeProductMap.find(p => p.localId === localProductId)
  return mapping?.stripePriceId || null
}

export function getStripeProductId(localProductId: number): string | null {
  const mapping = stripeProductMap.find(p => p.localId === localProductId)
  return mapping?.stripeProductId || null
}
