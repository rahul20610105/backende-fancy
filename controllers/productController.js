import Product from '../models/productModel.js'; // Import your Product model

// Function to add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1[0];
        const image2 = req.files.image2[0];
        const image3 = req.files.image3[0];
        const image4 = req.files.image4[0];

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            subcategory,
            sizes,
            bestseller,
            images: [image1.path, image2.path, image3.path, image4.path] // Save the image paths
        });

        await newProduct.save();
        res.json({ success: true, message: "Product added successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred" });
    }
};

// Function to remove product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: "Product removed successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred" });
    }
};

// Function to list products
const listProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred" });
    }
};

// Function to get single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            res.json({ success: true, product });
        } else {
            res.json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred" });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };
