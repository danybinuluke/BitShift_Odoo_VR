import express from "express";

const router = express.Router();

// Temporary test route
router.get("/", (req, res) => {
    res.json({ message: "Trip route working" });
});

export default router;