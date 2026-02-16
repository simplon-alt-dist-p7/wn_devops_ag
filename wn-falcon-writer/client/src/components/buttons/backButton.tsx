import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
    to?: string;
    label?: string;
};

export default function BackButton({
                                       to = "/articles",
                                       label = "Retour",
                                   }: Props) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(to)}
            className="inline-flex items-center gap-2 rounded-md px-1 py-0.5 text-sm font-semibold text-primary
                 hover:bg-black/5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/30"
        >
            <IoMdArrowRoundBack size={20} />
            {label}
        </button>
    );
}
