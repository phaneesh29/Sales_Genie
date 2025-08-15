export const healthController = (req, res) => {
    res.status(200).json({ status: "OK",date: new Date() });
}