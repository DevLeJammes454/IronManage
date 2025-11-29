const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { userId: req.user.id },
            orderBy: { name: 'asc' },
        });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createClient = async (req, res) => {
    try {
        const { name, phone, address, email } = req.body;

        const newClient = await prisma.client.create({
            data: {
                name,
                phone,
                address,
                email,
                userId: req.user.id,
            },
        });
        res.status(201).json(newClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, email } = req.body;

        const client = await prisma.client.findFirst({
            where: { id: parseInt(id), userId: req.user.id },
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const updatedClient = await prisma.client.update({
            where: { id: parseInt(id) },
            data: {
                name,
                phone,
                address,
                email,
            },
        });
        res.json(updatedClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await prisma.client.findFirst({
            where: { id: parseInt(id), userId: req.user.id },
        });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        await prisma.client.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Client deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
