const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMaterials = async (req, res) => {
    try {
        const materials = await prisma.material.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(materials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        const { name, category, price_black, price_zintro, length, stock } = req.body;

        const newMaterial = await prisma.material.create({
            data: {
                name,
                category,
                price_black,
                price_zintro,
                length: length || 6.00,
                stock: parseInt(stock),
                userId: req.user.id,
            },
        });
        res.status(201).json(newMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { price_black, price_zintro, stock } = req.body;

        const material = await prisma.material.findFirst({
            where: { id: parseInt(id), userId: req.user.id },
        });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        const updatedMaterial = await prisma.material.update({
            where: { id: parseInt(id) },
            data: {
                price_black,
                price_zintro,
                stock: parseInt(stock),
            },
        });
        res.json(updatedMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;

        const material = await prisma.material.findFirst({
            where: { id: parseInt(id), userId: req.user.id },
        });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        await prisma.material.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Material deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
