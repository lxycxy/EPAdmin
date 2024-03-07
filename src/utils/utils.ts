export function recoverGTM8(time : Date) {
    time.setHours(time.getHours() + 8);
    return time.toISOString().slice(0, 19).replace('T', ' ');
}