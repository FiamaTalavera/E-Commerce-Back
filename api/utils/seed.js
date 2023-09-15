const Category = require("../models/Category");
const Product = require("../models/Products");

const fakeDataCategories = [
  {
    name: "salado",
  },
  {
    name: "dulce",
  },
  {
    name: "bebida",
  },
];

const fakeData = [
  {
    name: "Tostado",
    description: "Tostado de jamón y queso",
    price: 400,
    imageURL:
      "https://i.pinimg.com/564x/02/57/e7/0257e7ceb181fb5118f914c16563f784.jpg",
    stock: 6,
    categoryId: 1,
  },
  {
    name: "Toston de palta",
    description: "Tostada de pan de campo con palta, huevo y especias",
    price: 500,
    imageURL:
      "https://i.pinimg.com/564x/45/46/96/4546965f7dd683548fd3609cd8f20776.jpg",
    stock: 4,
  },
  {
    name: "Chipa",
    description:
      "Pan elaborado con almidón de mandioca (yuca), huevos y mucho queso",
    price: 200,
    imageURL:
      "https://i.pinimg.com/564x/b9/66/b6/b966b6fd1cac5873792d2289725a50e2.jpg",
    stock: 10,
  },
  {
    name: "Marquise",
    description:
      "Base de brownie, con dulce de leche, crema batida y chocolate",
    price: 600,
    imageURL:
      "https://i.pinimg.com/564x/c0/7d/51/c07d510d360fc10601fbd52a528c7a08.jpg",
    stock: 1,
  },
  {
    name: "Galletas de chips de chocolate",
    description: "Galletas sabor vainilla con chips de chocolate",
    price: 150,
    imageURL:
      "https://i.pinimg.com/564x/31/56/ed/3156ed3afc3aa8e3dd76b021347cc013.jpg",
    stock: 5,
  },
  {
    name: "Medialunas",
    description: "Masa a base de harina y manteca, cubiertos de almíbar",
    price: 900,
    imageURL:
      "https://i.pinimg.com/564x/b9/e9/90/b9e990005bc2b43b4210cd2f78e4a850.jpg",
    stock: 12,
  },
  {
    name: "Cafe",
    description: "Clásico cortado",
    price: 120,
    imageURL:
      "https://i.pinimg.com/564x/35/cd/21/35cd218bab9b3cd07468de889149397d.jpg",
    stock: 15,
  },
  {
    name: "Jugo de naranja",
    description: "Jugo exprimido de naranja",
    price: 220,
    imageURL:
      "https://i.pinimg.com/564x/a7/bf/68/a7bf68a8976eb5a1f4294945de840850.jpg",
    stock: 8,
  },
  {
    name: "Licuado de frutilla",
    description: "Licuado de frutila, a elección base de agua o leche",
    price: 300,
    imageURL:
      "https://i.pinimg.com/564x/27/91/aa/2791aa0bcebd06300e307ccfe5cd1e76.jpg",
    stock: 7,
  },
];

const seed = async () => {
  await Category.bulkCreate(fakeDataCategories);
  await Product.bulkCreate(fakeData);
};

seed();
