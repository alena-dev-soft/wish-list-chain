import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WishlistV3Module = buildModule("WishlistV3Module", (m) => {
  const wishlistV3 = m.contract("WishlistV3");

  return { wishlistV3 };
});

export default WishlistV3Module;