import { MdEdit } from "react-icons/md";

type Props = {
    onClick: () => void;
    className?: string;
    label?: string;
};

export default function EditArticleButton({
                                              onClick,
                                              className = "",
                                              label = "modifier",
                                          }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center rounded-lg bg-primary px-4 py-2 mt-4 text-secondary text-sm font-semibold hover:opacity-95 ${className}`}
        >
            {label} <MdEdit className="ml-2" />
        </button>
    );
}
