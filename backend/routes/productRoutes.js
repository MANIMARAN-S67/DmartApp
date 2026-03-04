const express = require('express');
const router = express.Router();
const conn = require('../config/salesforce');

// Get all products (Queries Product2 in Salesforce)
router.get('/', async (req, res) => {
    try {
        // You might need to adjust fields based on your Salesforce schema
        // PricebookEntry is often used to get the price of a product
        const query = `
            SELECT Id, Name, ProductCode, Description, Family, IsActive 
            FROM Product2 
            WHERE IsActive = true 
            LIMIT 100
        `;

        let result;
        try {
            result = await conn.query(query);
            res.status(200).json({
                message: 'Products retrieved successfully',
                products: result.records
            });
        } catch (sfError) {
            console.warn('Salesforce query failed, using mock data:', sfError.message);
            res.status(200).json({
                message: 'Products retrieved from Mock Data',
                products: [
                    { Id: '1', Name: 'Fresh Apple', ProductCode: 'FR-APP', Description: 'Juicy apples', Family: 'Fruits', Price: 120, emoji: '🍎' },
                    { Id: '2', Name: 'Green Broccoli', ProductCode: 'VG-BRC', Description: 'Organic broccoli', Family: 'Vegetables', Price: 50, emoji: '🥦' },
                    { Id: '3', Name: 'Whole Milk', ProductCode: 'DY-MLK', Description: '1L Cow milk', Family: 'Dairy', Price: 65, emoji: '🥛' },
                    { Id: '4', Name: 'Brown Rice', ProductCode: 'GR-BRC', Description: '1kg brown rice', Family: 'Grains', Price: 110, emoji: '🌾' },
                    { Id: '5', Name: 'Chicken Breast', ProductCode: 'MT-CB', Description: '500g Fresh chicken', Family: 'Meat', Price: 250, emoji: '🍗' },
                    { Id: '6', Name: 'Dish Wash Liquid', ProductCode: 'HC-DW', Description: '500ml cleaner', Family: 'HomeCare', Price: 90, emoji: '✨' },
                ]
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a single product by Id
router.get('/:id', async (req, res) => {
    try {
        const prodId = req.params.id;
        const query = `
            SELECT Id, Name, ProductCode, Description, Family, IsActive 
            FROM Product2 
            WHERE Id = '${prodId}' 
            LIMIT 1
        `;

        const result = await conn.query(query);

        if (result.records.length > 0) {
            res.status(200).json({ product: result.records[0] });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
