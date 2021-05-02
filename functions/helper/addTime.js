module.exports = (sec) => {
    const milisec = sec * 1000;
    return Date.now() + milisec + 1500;
}