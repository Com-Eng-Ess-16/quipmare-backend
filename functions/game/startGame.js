module.exports = async (req,res)=>{
    const roomcode = req.params.roomcode;
    return res.json({
        gameID: "game-" + roomcode
    });
}