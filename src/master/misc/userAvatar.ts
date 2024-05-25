import { User } from "discord.js";

type Options = {
    size: 1024 | 16 | 32 | 64 | 128 | 256 | 512 | 2048 | 4096;
    extension: "webp" | "png" | "jpg" | "jpeg" | "gif";
    forceStatic: boolean;
}

export async function getUserAvatarFile(target: User, opts?: Options) {
    const size = opts?.size || 1024;
    const extension = opts?.extension || "png";
    const forceStatic = opts?.forceStatic || true;
    return target.displayAvatarURL({ size: size, extension: extension, forceStatic: forceStatic });
}