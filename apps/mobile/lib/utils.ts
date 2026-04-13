import { type ClassValue, clsx } from "clsx";
import { ProductDto } from "interfaces";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const testProducts: ProductDto[] = [
    {
        id: 1,
        name: "Wireless Headphones",
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
        price: 149.99,
        image: ["https://cdn.mos.cms.futurecdn.net/FkGweMeB7hdPgaSFQdgsfj-2000-80.jpg"],
        description: "Track your fitness and notifications with this sleek smartwatch.",
        trending: true,
        bestSeller: false,
        sale: true,
        salePrice: 119.99,
        stock: 40,
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
        price: 129.99,
        image: ["https://images.indianexpress.com/2021/06/Corsair-Mechanical-Keyboard.jpg"],
        description: "Mechanical keyboard with blue switches for tactile feedback.",
        trending: true,
        bestSeller: true,
        sale: true,
        salePrice: 99.99,
        stock: 35,
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
        creationDate: new Date("2023-07-22"),
        details: {
            Material: "Aluminum",
            "Height Adjustment": "5 levels",
            Compatibility: "Fits laptops up to 17 inches",
        },
    },
];
