

const Item = require("../models/itemModel");

const createItem = async (req, res) => {
  try {
    const { name, brand, category, description, mrp, variants } = req.body;

    if (!name || !brand || !category || !mrp || !variants) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ FIND COVER IMAGE CORRECTLY
    const coverImageFile = req.files.find(
      (file) => file.fieldname === "coverImage"
    );

    if (!coverImageFile) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const parsedVariants = JSON.parse(variants);

    if (!parsedVariants.length) {
      return res.status(400).json({ message: "At least one variant required" });
    }

    // ✅ MAP VARIANT IMAGES CORRECTLY
    const variantImageMap = {};

    req.files.forEach((file) => {
      if (file.fieldname.startsWith("variantImages_")) {
        const index = file.fieldname.split("_")[1];
        if (!variantImageMap[index]) {
          variantImageMap[index] = [];
        }
        variantImageMap[index].push(`uploads/${file.filename}`);
      }
    });

    const finalVariants = parsedVariants.map((v, index) => {
      if (!v.label || v.price <= 0 || v.stock < 0) {
        throw new Error(`Invalid variant data: ${v.label}`);
      }

      return {
        label: v.label,
        price: Number(v.price),
        stock: Number(v.stock),
        images: variantImageMap[index] || [],
      };
    });

    const item = await Item.create({
      name,
      brand,
      category,
      description,
      mrp: Number(mrp),
      coverImage: `uploads/${coverImageFile.filename}`,
      variants: finalVariants,
    });

    res.status(201).json({
      message: "Product created successfully",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};



// const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     /* ================= PARSE VARIANTS ================= */

//     let parsedVariants = [];

//     if (updates.variants) {
//       parsedVariants = JSON.parse(updates.variants);
//     }

//     /* ================= MAP VARIANT IMAGES ================= */

//     const variantImageMap = {};

//     if (req.files && Array.isArray(req.files)) {
//       req.files.forEach((file) => {
//         if (file.fieldname.startsWith("variantImages_")) {
//           const index = file.fieldname.split("_")[1];
//           if (!variantImageMap[index]) {
//             variantImageMap[index] = [];
//           }
//           variantImageMap[index].push(`uploads/${file.filename}`);
//         }
//       });
//     }

//     /* ================= BUILD FINAL VARIANTS ================= */

//     if (parsedVariants.length) {
//       updates.variants = parsedVariants.map((v, index) => {
//         return {
//           label: v.label,
//           price: Number(v.price),
//           stock: Number(v.stock),

//           // 🔥 KEY FIX: keep old images if no new ones uploaded
//           images:
//             variantImageMap[index] && variantImageMap[index].length > 0
//               ? variantImageMap[index]
//               : v.images || [],
//         };
//       });
//     }

//     /* ================= COVER IMAGE ================= */

//     const coverImageFile = req.files?.find(
//       (file) => file.fieldname === "coverImage"
//     );

//     if (coverImageFile) {
//       updates.coverImage = `uploads/${coverImageFile.filename}`;
//     }

//     /* ================= UPDATE ================= */

//     const item = await Item.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     res.json({ message: "Product updated successfully", item });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message || "Update failed" });
//   }
// };



// GET /api/items - list items



// const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     /* ================= PARSE VARIANTS ================= */

//     let parsedVariants = [];
//     if (updates.variants) {
//       parsedVariants = JSON.parse(updates.variants);
//     }

//     /* ================= MAP VARIANT IMAGES ================= */

//     const variantImageMap = {};

//     if (req.files && Array.isArray(req.files)) {
//       req.files.forEach((file) => {
//         if (file.fieldname.startsWith("variantImages_")) {
//           const index = Number(file.fieldname.split("_")[1]);
//           if (!variantImageMap[index]) {
//             variantImageMap[index] = [];
//           }
//           variantImageMap[index].push(`uploads/${file.filename}`);
//         }
//       });
//     }

//     /* ================= BUILD VARIANTS ================= */

//     // if (parsedVariants.length) {
//     //   updates.variants = parsedVariants.map((v, index) => {
//     //     return {
//     //       label: v.label,
//     //       price: Number(v.price),
//     //       stock: Number(v.stock),

//     //       // 🔥 THIS IS THE KEY LINE
//     //       images:
//     //         variantImageMap[index]?.length > 0
//     //           ? variantImageMap[index]
//     //           : v.images || [],
//     //     };
//     //   });
//     // }


//     if (parsedVariants.length) {
//       updates.variants = parsedVariants.map((v, index) => {
//         return {
//           label: v.label,
//           price: Number(v.price),
//           stock: Number(v.stock),
//           images:
//             variantImageMap[index]?.length > 0
//               ? variantImageMap[index]
//               : v.images || [],
//         };
//       });
//     }

//     if (!Array.isArray(updates.variants)) {
//       updates.variants = [];
//     }


//     /* ================= COVER IMAGE ================= */

//     const coverImageFile = req.files?.find(
//       (file) => file.fieldname === "coverImage"
//     );

//     if (coverImageFile) {
//       updates.coverImage = `uploads/${coverImageFile.filename}`;
//     }

//     /* ================= UPDATE ================= */

//     const item = await Item.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     res.json({ message: "Product updated successfully", item });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message || "Update failed" });
//   }
// };

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    const body = req.body;

    /* ================= BASIC FIELDS (PATCH SAFE) ================= */

    if (body.name) updates.name = body.name;
    if (body.brand) updates.brand = body.brand;
    if (body.category) updates.category = body.category;
    if (body.description !== undefined) updates.description = body.description;
    if (body.mrp) updates.mrp = Number(body.mrp);

    /* ================= VARIANTS ================= */

    let parsedVariants = null;

    if (body.variants) {
      parsedVariants = JSON.parse(body.variants);
    }

    // 🔹 Map new uploaded images
    const variantImageMap = {};

    if (req.files?.length) {
      req.files.forEach((file) => {
        if (file.fieldname.startsWith("variantImages_")) {
          const index = Number(file.fieldname.split("_")[1]);
          if (!variantImageMap[index]) variantImageMap[index] = [];
          variantImageMap[index].push(`uploads/${file.filename}`);
        }
      });
    }

    // 🔹 Build variants WITHOUT deleting images
    if (parsedVariants) {
      updates.variants = parsedVariants.map((v, index) => ({
        label: v.label,
        price: Number(v.price),
        stock: Number(v.stock),
        images:
          variantImageMap[index]?.length > 0
            ? [...(v.images || []), ...variantImageMap[index]] // ✅ MERGE
            : v.images || [], // ✅ KEEP OLD
      }));
    }

    /* ================= COVER IMAGE ================= */

    const coverImageFile = req.files?.find(
      (file) => file.fieldname === "coverImage"
    );

    if (coverImageFile) {
      updates.coverImage = `uploads/${coverImageFile.filename}`;
    }

    /* ================= UPDATE ================= */

    const item = await Item.findByIdAndUpdate(
      id,
      { $set: updates }, // ✅ PATCH UPDATE
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Update failed",
    });
  }
};




// const listItems = async (req, res) => {
//   try {
//     const items = await Item.aggregate([
//       {
//         $project: {
//           name: 1,
//           brand: 1,
//           category: 1,
//           description: 1,
//           mrp: 1,
//           coverImage: 1,
//           variants: {
//             label: 1,
//             price: 1,
//             stock: 1,
//             images: 1,
//           },
//           createdAt: 1,
//         },
//       },
//       {
//         $addFields: {
//           minPrice: { $min: "$variants.price" },
//           maxPrice: { $max: "$variants.price" },
//           totalStock: { $sum: "$variants.stock" },
//           variantLabels: "$variants.label",
//         },
//       },
//       { $sort: { createdAt: -1 } },
//     ]);

//     res.json(items);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };





// controllers/itemController.js




const listItems = async (req, res) => {
  try {
    const items = await Item.aggregate([
      {
        $project: {
          name: 1,
          brand: 1,
          category: 1,
          description: 1,
          mrp: 1,
          coverImage: 1,
          variants: 1, // ✅ IMPORTANT
          createdAt: 1,
        },
      },
      {
        $addFields: {
          minPrice: {
            $min: {
              $map: {
                input: "$variants",
                as: "v",
                in: "$$v.price",
              },
            },
          },
          maxPrice: {
            $max: {
              $map: {
                input: "$variants",
                as: "v",
                in: "$$v.price",
              },
            },
          },
          totalStock: {
            $sum: {
              $map: {
                input: "$variants",
                as: "v",
                in: "$$v.stock",
              },
            },
          },
          variantLabels: {
            $map: {
              input: "$variants",
              as: "v",
              in: "$$v.label",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]).allowDiskUse(true); // ✅ prevents memory timeout

    res.json(items);
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};



module.exports = { createItem, updateItem, listItems, deleteItem };