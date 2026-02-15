

// const mongoose = require("mongoose");

// const itemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   brand: { type: String, required: true },
//   category: { type: String, required: true },
//   size: { type: String, required: true }, // for apparel
//   modelOrCapacity: { type: String }, // for electronics
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   mrp: { type: Number, required: true },
//   quantity: { type: Number, required: true, default: 0 },
//   image: { type: String, required: true }, // store image URL/path
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Item", itemSchema);




// const itemSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     brand: { type: String, required: true },
//     category: { type: String, required: true },

//     variants: [
//       {
//         label: { type: String }, // S, M, L, 128GB, etc
//         price: { type: Number, required: true },
//         mrp: { type: Number, required: true },
//         quantity: { type: Number, default: 0 },
//       },
//     ],

//     description: { type: String, required: true },

//     discount: {
//       type: Number,
//       default: 0, // %
//       min: 0,
//       max: 100,
//     },

//     images: [{ type: String, required: true }],

//     status: {
//       type: String,
//       enum: ["Active", "Inactive"],
//       default: "Active",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Item", itemSchema);



const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [String],
});

const itemSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    category: String,
    description: String,
    mrp: Number,
    coverImage: String,
    variants: [variantSchema],
  },
  { timestamps: true }
);

itemSchema.index({ category: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ "variants.price": 1 });

module.exports = mongoose.model("Item", itemSchema);
