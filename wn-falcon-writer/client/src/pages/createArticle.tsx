import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/articleForm.tsx";

export default function CreateArticle() {
    const navigate = useNavigate();

    return (
        <ArticleForm
            onClose={() => navigate("/articles")}
        />
    );
}
