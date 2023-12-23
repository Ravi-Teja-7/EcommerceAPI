const Product = require('../models/product');

// function to show all the products
// module.exports.products = function(req, res){
//     Product.find({}, function(err, foundProducts){
//         if(err){
//             res.send(err);
//         }else{
//             res.send(foundProducts);
//         }
//     });
// }
module.exports.products = async function(req, res){
    try {
        const foundProducts = await Product.find({}).exec();
        res.send(foundProducts);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// function to create a new product
// module.exports.create = function(req, res){
//     const newProduct = new Product({
//         name: req.body.name,
//         quantity: req.body.quantity
//     });
//     newProduct.save(function(err){
//         if(err){
//             res.send(err);
//         }else{
//             res.send('New product added successfully.');
//         }
//     });
// }
module.exports.create = async function(req, res){
    try {
        const newProduct = new Product({
            name: req.body.name,
            quantity: req.body.quantity
        });
        await newProduct.save();
        res.send('New product added successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
}


// function to delete a product using it's ID
// module.exports.delete = function(req, res){
//     Product.deleteOne(
//         {_id: req.params.productID},
//         function(err){
//             if(err){
//                 res.send(err);
//             }else{
//                 res.send({
//                     message: "Product deleted"
//                 });
//             }
//         });
// }
module.exports.delete = async function(req, res){
    try {
        await Product.deleteOne({_id: req.params.productID});
        res.send({ message: "Product deleted" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}


// function to update a product's quantity
// module.exports.updateQunatity = function(req, res){
//     const ID = req.params.productID;
//     // find the product using id
//     Product.findById(ID, function(err, found){
//         if(err){
//             res.send(err);
//         }else{

//             // Note - To increment the quantity of the product put number as a positive value in the query 
//             //        and to decrement the quantity put the number as negative value in the query

//             const newQty = parseInt(found.quantity) + parseInt(req.query.number);
//             // update the product's quantity
//             Product.findByIdAndUpdate(ID, {quantity: newQty}, function(err, updatedProduct){
//                 if(err){
//                     res.send(err);
//                 }else{
//                     updatedProduct.quantity = newQty;
//                     res.send({
//                         product: updatedProduct,
//                         message: 'updated successfully'
//                     });
//                 }
//             });
//         }
//     });
// }

module.exports.updateQuantity = async function(req, res){
    try {
        const ID = req.params.productID;
        
        const found = await Product.findById(ID).exec();

        if (!found) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const newQty = parseInt(found.quantity) + parseInt(req.query.number);
        
        const updatedProduct = await Product.findByIdAndUpdate(ID, {quantity: newQty}, { new: true }).exec();

        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found for update' });
        }

        updatedProduct.quantity = newQty;
        res.send({
            product: updatedProduct,
            message: 'Updated successfully'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
