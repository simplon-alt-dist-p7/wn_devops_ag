import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Articles from "./pages/articles.tsx";
import ArticlePage from "./pages/articlePage.tsx";
import CategoriesBar from "./components/categoriesBar.tsx";
import Footer from "./components/footer.tsx";
import { useLayoutEffect } from "react";

function ScrollToTop() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.key]); 
  return null;
}
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <header>
        <CategoriesBar />
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/articles" replace />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route path="*" element={<p>Page introuvable</p>} />
          </Routes>
        </main>
        <footer className="md:hidden">
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}
