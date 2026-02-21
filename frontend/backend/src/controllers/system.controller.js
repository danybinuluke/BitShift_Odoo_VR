export const systemStatusController = async (req, res) => {

    res.json({
        backend: "UP",
        aiService: process.env.AI_SERVICE_URL,
        timestamp: new Date(),
        uptime: process.uptime()
    });

};