import { Response, Request } from "express";
import { string, z } from "zod";

const CARD_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20] // All possible cards
export const DECK_SIZE = 10

export const DeckSchema = z.object({
    deck: z.array(
      z.number().refine((val) => CARD_IDS.includes(val))
    ).length(DECK_SIZE),
    deckName: string().min(1),
})


export type DeckBody = z.infer<typeof DeckSchema>
export type DeckPOSTRequestBody = Request<{}, {}, DeckBody>
export type DeckPutRequestBody = Request<{ deckid: string}, {}, DeckBody>