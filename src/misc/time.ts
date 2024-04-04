export function timeLeft(birthday: string) {
    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1; // Adjust month number to human-readable format

    let birthdayArray = birthday.split("/");
    let birthMonth = parseInt(birthdayArray[0]);
    let birthDay = parseInt(birthdayArray[1]);

    if (currentMonth === birthMonth) {
        if (currentDay < birthDay) {
            return birthDay - currentDay;
        } else if (currentDay > birthDay) {
            let daysInCurrentMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
            let daysAfterToday = daysInCurrentMonth - currentDay;
            let daysUntilEndOfYear = 0;
            for (let i = currentMonth + 1; i <= 12; i++) {
                daysUntilEndOfYear += new Date(currentDate.getFullYear(), i, 0).getDate();
            }
            let daysInNextYearUntilBirthMonth = 0;
            for (let i = 1; i < birthMonth; i++) {
                daysInNextYearUntilBirthMonth += new Date(currentDate.getFullYear() + 1, i, 0).getDate();
            }
            return daysAfterToday + daysUntilEndOfYear + daysInNextYearUntilBirthMonth + birthDay;
        } else {
            return 0; // Today is the birthday
        }
    } else {
        let daysLeft = 0;
        if (currentMonth < birthMonth) {
            for (let i = currentMonth; i < birthMonth; i++) {
                daysLeft += new Date(currentDate.getFullYear(), i, 0).getDate();
            }
        } else {
            for (let i = currentMonth; i <= 12; i++) {
                daysLeft += new Date(currentDate.getFullYear(), i, 0).getDate();
            }
            for (let i = 1; i < birthMonth; i++) {
                daysLeft += new Date(currentDate.getFullYear(), i, 0).getDate();
            }
        }
        return daysLeft - currentDay + birthDay;
    }
}