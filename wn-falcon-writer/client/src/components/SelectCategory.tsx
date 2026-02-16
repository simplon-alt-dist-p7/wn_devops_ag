import { useEffect, useState } from "react";
import { getCategories } from "../services/category";
import type { Category } from "../types/category";

type Props = {
    value?: number;
    onChange: (value: number) => void;
    error?: string;
};

export default function SelectCategory({ value, onChange, error }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Catégorie</label>

            <select
                value={value ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={loading}
                className="rounded-lg border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
            >
                <option value="" disabled>
                    {loading ? "Chargement..." : "Choisir une catégorie"}
                </option>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                    </option>
                ))}
            </select>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}