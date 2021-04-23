module.exports = async (req,res)=>{
    const id = req.params.id;
    return res.json({
        question: "Question" + id
    });
}