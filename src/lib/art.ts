import coin from "@/assets/sym-coin.png";
import bolt from "@/assets/sym-bolt.png";
import gem from "@/assets/sym-gem.png";
import chest from "@/assets/sym-chest.png";
import rocket from "@/assets/nav-rocket.png";
import bag from "@/assets/nav-bag.png";
import book from "@/assets/nav-book.png";
import wheel from "@/assets/nav-wheel.png";
import pumpkin from "@/assets/tok-pumpkin.png";
import frog from "@/assets/tok-frog.png";
import star from "@/assets/tok-star.png";
import type { Sym } from "@/lib/game";

export const TOKEN_ART: Record<string, string> = { pumpkin, frog, star };
export const SYM_ART: Record<Sym, string> = { coin, bolt, gem, chest, token: pumpkin };
export const ART = { coin, bolt, gem, chest, rocket, bag, book, wheel };
