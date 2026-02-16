import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {
    setNewArticleForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddArticleButton({ setNewArticleForm }: Props) {
    const handleClick = () => {
        setNewArticleForm(true);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-secondary text-sm font-semibold hover:opacity-95"
        >
            <IoMdAddCircleOutline size={20} />
            Ajouter un nouvel article
        </button>
    );
}
