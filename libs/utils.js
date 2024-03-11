function checkTime() {
    const _date = new Date()
    
    const date = ("0" + _date.getDate()).slice(-2)
    const month = ("0" + _date.getMonth() + 1).slice(-2)
    const year = _date.getFullYear()
    const hours = _date.getHours()
    const minutes = _date.getMinutes()
    const seconds = _date.getSeconds()

    return date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds
}

module.exports = {checkTime}