export function CategoryBadge({ category }: { category: string | undefined }) {
    return (
        <div className="bg-primary/92 inline-flex px-3 py-1 rounded-full items-center max-w-max justify-center h6">
            <span className="text-sm text-white">{category}</span>
        </div>
    );
}