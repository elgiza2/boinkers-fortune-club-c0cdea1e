import { expect, it } from "vitest";
import { NFT_ITEMS, filterNfts } from "./nft";
it("provides more than 50 distinct collectible artworks", () => {
  expect(NFT_ITEMS.length).toBeGreaterThan(50);
  expect(new Set(NFT_ITEMS.map(item => item.image)).size).toBe(NFT_ITEMS.length);
  expect(NFT_ITEMS.every(item => item.image.length > 0)).toBe(true);
});
it("filters collectibles by collection and name", () => {
  expect(filterNfts("Astronaut", "Explorers").map(item => item.id)).toEqual([1]);
  expect(filterNfts("Astronaut", "Fantasy")).toEqual([]);
});