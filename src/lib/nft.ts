const images = import.meta.glob<string>("../assets/nft-*-*.webp", { eager: true, query: "?url", import: "default" });
const groups = [
  { key: "explorers", name: "Explorers", names: ["Astronaut", "Pirate", "Knight", "Diver", "Aviator", "Explorer", "Firefighter", "Doctor", "Chef", "Detective", "Sailor", "Cowboy", "Ninja", "Samurai", "Ranger", "Skier", "Surfer", "Cyclist", "Racer", "Mountaineer"] },
  { key: "fantasy", name: "Fantasy", names: ["Ice King", "Fire Wizard", "Forest Fairy", "Moon Mage", "Dragon Keeper", "Crystal Knight", "Mushroom Druid", "Ocean Prince", "Star Angel", "Shadow Rogue", "Royal Queen", "Golden Emperor", "Emerald Sorcerer", "Rainbow Unicorn", "Phoenix Warrior", "Snow Elf", "Flower Guardian", "Thunder Hero", "Candy Monarch", "Celestial Oracle"] },
  { key: "legends", name: "Legends", names: ["Neon DJ", "Rock Star", "Street Dancer", "Disco Star", "Street Artist", "Engineer", "Cyber Hero", "Arcade Champion", "Basketball Pro", "Football Star", "Tennis Ace", "Boxer", "Scientist", "Gardener", "Photographer", "Magician", "Gold Tycoon", "Jewel Collector", "Carnival Star", "Future Pilot"] },
] as const;
export const NFT_ITEMS = groups.flatMap((group, g) => group.names.map((name, i) => ({
  id: g * 20 + i + 1, name, group: group.name,
  rarity: i >= 16 ? "Legendary" : i >= 10 ? "Epic" : "Rare",
  price: i >= 16 ? 8 : i >= 10 ? 3 : 1, // TON
  image: images[`../assets/nft-${group.key}-${i + 1}.webp`] ?? "",
})));
export type NftItem = typeof NFT_ITEMS[number];
export function filterNfts(query: string, group: string) {
  const q = query.trim().toLowerCase();
  return NFT_ITEMS.filter(item => (group === "All" || item.group === group) && (!q || `${item.name} ${item.id}`.toLowerCase().includes(q)));
}