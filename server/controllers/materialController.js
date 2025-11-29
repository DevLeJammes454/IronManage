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

        // Check if material with same name exists for this user
        const existingMaterial = await prisma.material.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive', // Case insensitive check
                },
                userId: req.user.id
            }
        });

        if (existingMaterial) {
            // Update existing material
            const updatedMaterial = await prisma.material.update({
                where: { id: existingMaterial.id },
                data: {
                    stock: existingMaterial.stock + parseInt(stock), // Add to existing stock
                    price_black: price_black, // Update to latest price
                    price_zintro: price_zintro, // Update to latest price
                    category: category, // Update category if changed
                    length: length || existingMaterial.length
                }
            });
            return res.status(200).json(updatedMaterial);
        }

        // Create new material
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
