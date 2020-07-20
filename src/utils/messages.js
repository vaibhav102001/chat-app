const createMessages = (text)=>{
    return {
        text,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    createMessages
}