import {
    calculateFleetRisk,
    recommendAssignment,
    getFleetMetrics,
    getProfitMetrics
} from "../services/intelligence.service.js";


// ===============================
// Fleet Risk Controller
// ===============================
export const fleetRiskController = async (req, res) => {

    try {

        const result =
            await calculateFleetRisk();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Fleet Risk Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};



// ===============================
// Recommendation Controller
// ===============================
export const recommendAssignmentController =
    async (req, res) => {

        try {

            const {
                vehicleId,
                driverId,
                cargoWeight
            } = req.body;


            if (
                vehicleId === undefined ||
                driverId === undefined ||
                cargoWeight === undefined
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "vehicleId, driverId, cargoWeight required"
                });

            }


            const result =
                await recommendAssignment(
                    vehicleId,
                    driverId,
                    cargoWeight
                );


            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            console.error("Recommendation Error:", error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    };



// ===============================
// Fleet Metrics Controller
// ===============================
export const metricsController = async (req, res) => {

    try {

        const result =
            await getFleetMetrics();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error("Metrics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};



// ===============================
// Profit Metrics Controller
// ===============================
export const profitMetricsController =
    async (req, res) => {

        try {

            const result =
                await getProfitMetrics();

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            console.error("Profit Metrics Error:", error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    };