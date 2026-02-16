import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ArticleList from "./pages/articleList.tsx";
import ArticleDetails from "./pages/articleDetails.tsx";
import EditArticle from "./pages/editArticle";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/articles" replace />} />

                <Route path="/articles" element={<ArticleList />} />
                <Route path="/articles/:id" element={<ArticleDetails />} />
                <Route path="/articles/edit/:id" element={<EditArticle/>}/>

                <Route path="*" element={<p>Page introuvable</p>} />
            </Routes>
        </BrowserRouter>
    );
}
