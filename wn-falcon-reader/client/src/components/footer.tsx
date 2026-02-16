import { useEffect, useState } from "react";
import { getCategories } from "../services/category";
import { Link } from "react-router-dom";

export default function Footer() {
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
    <footer className="w-full bg-primary text-white mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link
              to="/articles"
              className="text-xl font-bold hover:text-gray-200 transition-colors"
            >
              World News
            </Link>
            <p className="text-gray-300 text-sm mt-2">
              Restez informé avec les dernières actualités mondiales
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Catégories</h3>
            <ul className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/articles?category=${category}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-4 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 World News. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
