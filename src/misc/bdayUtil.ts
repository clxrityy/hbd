import Birthday from "../models/Birthday";
import Wish from "../models/Wish";
import { WishData } from "./types";

export const getMonth = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

    return months[month - 1];
}

export const checkIfBirthdayMember = async (userId: string, guildId: string) => {

    let birthdayData = await Birthday.findOne({ UserID: userId, GuildID: guildId });

    if (!birthdayData) return "This user has not set their birthday!";

    const date = new Date();
    const dateString = date.toLocaleDateString();
    const dateArray = dateString.split("/")
    const dateParsed = dateArray[0] + `/` + dateArray[1];

    if (birthdayData.Birthday === dateParsed) {
        return true;
    }

    return false;
}

export const checkIfAlreadyWished = async ({ guildId, targetUserId, userId, year }: WishData) => {

    let wishData = await Wish.findOne({ GuildID: guildId, TargetUserID: targetUserId, UserID: userId, Year: year });

    if (wishData) {
        return true;
    }

    return false;
}

export const getUserWishes = async (targetUserId: string, guildId: string, year?: number)  => {

    let wishData = await Wish.find({ TargetUserID: targetUserId, GuildID: guildId, Year: year && year });

    if (!wishData) {
        return false;
    }

    let wishes: WishData[] = [];

    for (const wish of wishData) {
        if (year) {
            if (wish.Year === year) {
                wishes.push({ guildId: wish.GuildID, targetUserId: wish.TargetUserID, userId: wish.UserID, year: wish.Year, message: wish.Message && wish.Message})
            }
        } else {
            wishes.push({ guildId: wish.GuildID, targetUserId: wish.TargetUserID, userId: wish.UserID, year: wish.Year, message: wish.Message && wish.Message})
        }
    }

    return wishes;
}