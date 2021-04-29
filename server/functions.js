const getDate = () => {
    let date = new Date();
    let hours = date.getHours();
    hours = (hours < 10) ? `0${hours}` : hours;
    let minutes = date.getMinutes();
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    let seconds = date.getSeconds();
    seconds = (seconds < 10) ? `0${seconds}` : seconds;
    date = `${hours}:${minutes}:${seconds}`;
    return date;
}

module.exports = {
    getDate: getDate
};