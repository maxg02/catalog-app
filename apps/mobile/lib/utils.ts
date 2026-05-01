import { type ClassValue, clsx } from "clsx";
import { BusinessCategories } from "enums";
import { BusinessDto, ProductDto, SavedProductListDto, CartDto, UserBusinessDto } from "interfaces";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function toRgbChannels(color: string) {
    return color.split(/[,\s]+/).filter(Boolean).join(", ");
}

export function toRgb(color: string) {
    return `rgb(${toRgbChannels(color)})`;
}

export function toRgba(color: string, alpha: number) {
    return `rgba(${toRgbChannels(color)}, ${alpha})`;
}

function createCart(cart: Omit<CartDto, "cartTotal" | "saleTotal">): CartDto {
    const cartTotal = cart.productData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const saleTotal = cart.productData.reduce(
        (sum, item) =>
            sum + (item.salePrice ? item.salePrice * item.quantity : item.price * item.quantity),
        0,
    );

    return {
        ...cart,
        cartTotal,
        saleTotal,
    };
}

const testBusinessImageUrl =
    "https://foodtank.com/wp-content/uploads/2021/09/gemma-stpjHJGqZyw-unsplash.jpg";

export const testBusinesses: BusinessDto[] = [
    {
        id: 1,
        name: "Café Aroma",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.5,
        image: testBusinessImageUrl,
        description: "Cafetería acogedora con una gran variedad de cafés artesanales.",
    },
    {
        id: 2,
        name: "TechZone",
        category: BusinessCategories.TECH,
        location: "placeholder",
        rating: 4.2,
        image: testBusinessImageUrl,
        description: "Tienda especializada en dispositivos electrónicos y accesorios.",
    },
    {
        id: 3,
        name: "FitLife Gym",
        category: BusinessCategories.FITNESS,
        location: "placeholder",
        rating: 4.7,
        image: testBusinessImageUrl,
        description: "Gimnasio moderno con entrenadores certificados y equipos de última generación.",
    },
    {
        id: 4,
        name: "Green Market",
        category: BusinessCategories.GROCERY,
        location: "placeholder",
        rating: 4.3,
        image: testBusinessImageUrl,
        description: "Supermercado con productos orgánicos y frescos.",
    },
    {
        id: 5,
        name: "Bella Moda",
        category: BusinessCategories.FASHION,
        location: "placeholder",
        rating: 4.1,
        image: testBusinessImageUrl,
        description: "Boutique de ropa moderna para todas las edades.",
    },
    {
        id: 6,
        name: "AutoCare Service",
        category: BusinessCategories.AUTOMOTIVE,
        location: "placeholder",
        rating: 4.6,
        image: testBusinessImageUrl,
        description: "Centro de mantenimiento y reparación de vehículos.",
    },
    {
        id: 7,
        name: "Book Haven",
        category: BusinessCategories.BOOKSTORE,
        location: "placeholder",
        rating: 4.8,
        image: testBusinessImageUrl,
        description: "Librería con una amplia colección de libros y ambiente tranquilo.",
    },
    {
        id: 8,
        name: "Pet World",
        category: BusinessCategories.PETS,
        location: "placeholder",
        rating: 4.4,
        image: testBusinessImageUrl,
        description: "Tienda especializada en productos y cuidado para mascotas.",
    },
    {
        id: 9,
        name: "Spa Relax",
        category: BusinessCategories.BEAUTY,
        location: "placeholder",
        rating: 4.9,
        image: testBusinessImageUrl,
        description: "Centro de spa con servicios de relajación y cuidado personal.",
    },
    {
        id: 10,
        name: "QuickBites",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.0,
        image: testBusinessImageUrl,
        description: "Restaurante de comida rápida con opciones variadas y económicas.",
    },
];

export const testProducts: ProductDto[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        status: "public",
        price: 99.99,
        image: [
            "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/413_lifestyle.png?v=1752737623&width=400",
        ],
        description: "High-quality wireless headphones with noise cancellation.",
        trending: true,
        bestSeller: true,
        sale: false,
        salePrice: null,
        stock: 25,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-01-15"),
        details: {
            "Battery Life": "20 hours",
            Connectivity: "Bluetooth 5.0",
            Color: "Black",
        },
    },
    {
        id: 2,
        name: "Smart Watch",
        status: "public",
        price: 149.99,
        image: ["https://cdn.mos.cms.futurecdn.net/FkGweMeB7hdPgaSFQdgsfj-2000-80.jpg"],
        description: "Track your fitness and notifications with this sleek smartwatch.",
        trending: true,
        bestSeller: false,
        sale: true,
        salePrice: 119.99,
        stock: 40,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-02-20"),
        details: {
            Display: "1.5-inch AMOLED",
            "Water Resistance": "5 ATM",
            Compatibility: "iOS and Android",
        },
    },
    {
        id: 3,
        name: "Gaming Mouse",
        status: "draft",
        price: 59.99,
        image: [
            "https://assetsio.gnwcdn.com/g502x_f9QuuM8.jpeg?width=690&quality=85&format=jpg&dpr=3&auto=webp",
        ],
        description: "Ergonomic gaming mouse with customizable RGB lighting.",
        trending: false,
        bestSeller: true,
        sale: false,
        salePrice: null,
        stock: 60,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-03-10"),
        details: {
            DPI: "Up to 16,000",
            Buttons: "11 programmable",
            Sensor: "Optical",
        },
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        status: "public",
        price: 129.99,
        image: ["https://images.indianexpress.com/2021/06/Corsair-Mechanical-Keyboard.jpg"],
        description: "Mechanical keyboard with blue switches for tactile feedback.",
        trending: true,
        bestSeller: true,
        sale: true,
        salePrice: 99.99,
        stock: 35,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-04-05"),
        details: {
            "Switch Type": "Cherry MX Blue",
            Backlight: "RGB",
            "Key Rollover": "N-key",
        },
    },
    {
        id: 5,
        name: "4K Monitor",
        status: "draft",
        price: 399.99,
        image: [
            "https://m.media-amazon.com/images/S/aplus-media-library-service-media/85fa4d9d-eeff-4d9c-be6b-e9c71df5d317.__CR0,0,1200,900_PT0_SX600_V1___.jpg",
        ],
        description: "Ultra HD 4K monitor for stunning visuals and productivity.",
        trending: false,
        bestSeller: false,
        sale: true,
        salePrice: 349.99,
        stock: 20,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-05-12"),
        details: {
            Size: "27 inches",
            Resolution: "3840 x 2160",
            Panel: "IPS",
        },
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        status: "public",
        price: 79.99,
        image: [
            "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9130.jpg?width=2048&quality=60&crop=2048:1365&auto=webp",
        ],
        description: "Portable speaker with deep bass and long battery life.",
        trending: true,
        bestSeller: false,
        sale: false,
        salePrice: null,
        stock: 0,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-06-18"),
        details: {
            "Battery Life": "12 hours",
            Connectivity: "Bluetooth 5.0",
            Color: "Blue",
        },
    },
    {
        id: 7,
        name: "Laptop Stand",
        status: "draft",
        price: 39.99,
        image: [
            "https://callmateindia.com/cdn/shop/files/Black_1_8a97d0c4-b31e-4874-988b-f8eb9bf7703f.jpg?v=1721391709&width=2048",
        ],
        description: "Adjustable aluminum laptop stand for better ergonomics.",
        trending: false,
        bestSeller: true,
        sale: true,
        salePrice: 29.99,
        stock: 4,
        businessId: Math.floor(Math.random() * 10) + 1,
        creationDate: new Date("2023-07-22"),
        details: {
            Material: "Aluminum",
            "Height Adjustment": "5 levels",
            Compatibility: "Fits laptops up to 17 inches",
        },
    },
];

export const testSavedProductLists: SavedProductListDto[] = [
    {
        id: 1,
        businessId: 2,
        businessName: "TechZone",
        productData: [
            {
                ...testProducts[0], // Wireless Headphones
                businessId: 2,
            },
            {
                ...testProducts[1], // Smart Watch
                businessId: 2,
            },
            {
                ...testProducts[2], // Gaming Mouse
                businessId: 2,
            },
            {
                ...testProducts[3], // Mechanical Keyboard
                businessId: 2,
            },
        ],
    },
    {
        id: 2,
        businessId: 4,
        businessName: "Green Market",
        productData: [
            {
                ...testProducts[4], // 4K Monitor
                businessId: 4,
            },
        ],
    },
    {
        id: 3,
        businessId: 3,
        businessName: "FitLife Gym",
        productData: [
            {
                ...testProducts[5], // Bluetooth Speaker
                businessId: 3,
            },
        ],
    },
    {
        id: 4,
        businessId: 6,
        businessName: "AutoCare Service",
        productData: [
            {
                ...testProducts[6], // Laptop Stand
                businessId: 6,
            },
        ],
    },
];

export const testCarts: CartDto[] = [
    createCart({
        id: 1,
        businessData: testBusinesses[1], // TechZone
        productData: [
            {
                ...testProducts[0], // Wireless Headphones
                businessId: 2,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
            {
                ...testProducts[1], // Smart Watch
                businessId: 2,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
            {
                ...testProducts[2], // Gaming Mouse
                businessId: 2,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
            {
                ...testProducts[3], // Mechanical Keyboard
                businessId: 2,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
        ],
    }),
    createCart({
        id: 2,
        businessData: testBusinesses[2], // FitLife Gym
        productData: [
            {
                ...testProducts[5], // Bluetooth Speaker
                businessId: 3,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
        ],
    }),
    createCart({
        id: 3,
        businessData: testBusinesses[3], // Green Market
        productData: [
            {
                ...testProducts[4], // 4K Monitor
                businessId: 4,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
        ],
    }),
    createCart({
        id: 4,
        businessData: testBusinesses[5], // AutoCare Service
        productData: [
            {
                ...testProducts[6], // Laptop Stand
                businessId: 6,
                quantity: Math.floor(Math.random() * 10) + 1,
            },
        ],
    }),
];

// export const testUser: UserDto = {
//     id: "1",
//     name: "John Doe Perez",
//     email: "johndoe@email.com",
//     rol: "business",
// };

export const testUser: UserBusinessDto = {
    id: "1",
    name: "Repuestos Mandingo",
    email: "johndoe@email.com",
    rol: "business",
    insights: {
        overview: {
            catalogVisits: {
                total: 1285,
                previousTotal: 1142,
                weekly: {
                    mon: 184,
                    tue: 211,
                    wed: 236,
                    thu: 168,
                    fri: 256,
                    sat: 148,
                    sun: 82,
                },
            },
            ordersPlaced: {
                total: 934,
                previousTotal: 1049,
                weekly: {
                    mon: 132,
                    tue: 148,
                    wed: 121,
                    thu: 164,
                    fri: 188,
                    sat: 109,
                    sun: 72,
                },
            },
            cartsCreated: {
                total: 845,
                previousTotal: 1225,
                weekly: {
                    mon: 120,
                    tue: 200,
                    wed: 150,
                    thu: 80,
                    fri: 70,
                    sat: 110,
                    sun: 130,
                },
            },
        },
        productHighlights: [
            {
                label: "Most Saved",
                metric: "428 saves",
                product: testProducts[1],
            },
            {
                label: "Most Ordered",
                metric: "316 orders",
                product: testProducts[3],
            },
        ],
    },
};
