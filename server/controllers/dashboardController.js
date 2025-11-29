const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Total Revenue This Month
        const projectsThisMonth = await prisma.project.findMany({
            where: {
                userId,
                status: 'IN_PROGRESS', // Or 'COMPLETED' if we had that. Let's assume IN_PROGRESS counts as sold for now.
                createdAt: { gte: firstDayOfMonth },
            },
        });
        const totalRevenueMonth = projectsThisMonth.reduce((sum, p) => sum + Number(p.totalCost), 0);

        // 2. Active Projects
        const activeProjects = await prisma.project.count({
            where: {
                userId,
                status: { notIn: ['DRAFT', 'DELIVERED'] }, // Assuming DELIVERED is a future status
            },
        });

        // 3. Low Stock Count
        const lowStockCount = await prisma.material.count({
            where: {
                userId,
                stock: { lt: 5 },
            },
        });

        // 4. Monthly Sales History (Last 6 months)
        const monthlySalesHistory = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const monthProjects = await prisma.project.findMany({
                where: {
                    userId,
                    status: { not: 'DRAFT' },
                    createdAt: {
                        gte: date,
                        lt: nextMonth,
                    },
                },
            });

            const total = monthProjects.reduce((sum, p) => sum + Number(p.totalCost), 0);
            monthlySalesHistory.push({
                name: date.toLocaleString('default', { month: 'short' }),
                sales: total,
            });
        }

        res.json({
            total_revenue_month: totalRevenueMonth,
            active_projects: activeProjects,
            low_stock_count: lowStockCount,
            monthly_sales_history: monthlySalesHistory,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
