const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
    try {
        const { clientName, isZintro, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items provided' });
        }

        let totalCost = 0;
        const projectItemsData = [];

        // Calculate costs server-side
        for (const item of items) {
            const material = await prisma.material.findUnique({
                where: { id: parseInt(item.materialId) },
            });

            if (!material) {
                return res.status(404).json({ message: `Material ID ${item.materialId} not found` });
            }

            const price = isZintro ? Number(material.price_zintro) : Number(material.price_black);
            const barsNeeded = Math.ceil(Number(item.linear_meters) / 6.00);
            const itemCost = barsNeeded * price;

            totalCost += itemCost;

            projectItemsData.push({
                materialId: material.id,
                quantity_bars_needed: barsNeeded,
                linear_meters: Number(item.linear_meters),
                cost: itemCost,
            });
        }

        // Create Project and Items transactionally
        const newProject = await prisma.project.create({
            data: {
                userId: req.user.id,
                clientName,
                isZintro,
                totalCost,
                items: {
                    create: projectItemsData,
                },
            },
            include: {
                items: {
                    include: {
                        material: true,
                    },
                },
            },
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        material: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveProject = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Get Project with Items
            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
                include: { items: true },
            });

            if (!project) throw new Error('Project not found');
            if (project.status !== 'DRAFT') throw new Error('Project is not in DRAFT status');

            // 2. Process Items
            for (const item of project.items) {
                const material = await prisma.material.findUnique({
                    where: { id: item.materialId },
                });

                if (!material) throw new Error(`Material ${item.materialId} not found`);

                if (material.stock < item.quantity_bars_needed) {
                    throw new Error(`Insufficient stock for material: ${material.name}`);
                }

                // 3. Deduct Stock
                await prisma.material.update({
                    where: { id: material.id },
                    data: { stock: material.stock - item.quantity_bars_needed },
                });

                // 4. Calculate Offcut
                // Assuming standard length is 6m.
                // If meters needed is 7m, we use 2 bars (12m). Used 7m. Offcut is 5m.
                // Formula: (Bars * 6) - Meters
                const usedLength = parseFloat(item.linear_meters);
                const totalLength = item.quantity_bars_needed * 6.00;
                const offcutLength = totalLength - usedLength;

                // Only save significant offcuts (e.g., > 0.5m) to avoid clutter? 
                // User didn't specify, but let's save if > 0.
                if (offcutLength > 0) {
                    await prisma.offcut.create({
                        data: {
                            materialId: material.id,
                            length: offcutLength,
                            userId: req.user.id,
                        },
                    });
                }
            }

            // 5. Update Project Status
            return await prisma.project.update({
                where: { id: project.id },
                data: { status: 'IN_PROGRESS' },
            });
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message || 'Transaction failed' });
    }
};

exports.completeProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id), userId: req.user.id },
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.status !== 'IN_PROGRESS') {
            return res.status(400).json({ message: 'Project must be IN_PROGRESS to complete' });
        }

        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: { status: 'COMPLETED' },
        });

        res.json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
