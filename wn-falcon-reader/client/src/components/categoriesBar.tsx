import { useEffect, useState } from "react";
import { getCategories } from "../services/category";
import { Link } from "react-router-dom";

export default function CategoriesBar() {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getCategories();
                setCategories(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    
    return (
         <div className="w-full bg-primary">
            <nav className="container mx-auto flex flex-col md:flex-row md:items-center">
                <div className="px-4 py-3 md:py-3">
                    <Link to="/articles" className="text-white font-bold hover:text-gray-200 cursor-pointer whitespace-nowrap">
                        World News
                    </Link>
                </div>
                <div className="hidden md:block w-px h-6 bg-gray-500 flex-shrink-0 md:mx-4"></div>
                <div className="w-full md:w-auto overflow-x-auto md:overflow-visible">
                    <ul className="flex md:items-center md:gap-4 py-2 md:py-0">
                        {categories.map((category) => (
                            <li key={category} className="text-white hover:text-gray-200 cursor-pointer whitespace-nowrap px-4 md:px-2 md:flex-shrink-0">
                                <Link to={`/articles?category=${category}`}>{category}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}