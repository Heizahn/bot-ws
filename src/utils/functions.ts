export function formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith("0")) {
        return phoneNumber.replace("0", "58") + "@c.us";
    } else {
        return phoneNumber + "@c.us";
    }
}
