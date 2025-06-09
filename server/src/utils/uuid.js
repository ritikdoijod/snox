import { v7 as uuidv7 } from "uuid";

const generateInviteCode = () => uuidv7().replace(/-/g, "").substring(0, 8);

export { generateInviteCode };
