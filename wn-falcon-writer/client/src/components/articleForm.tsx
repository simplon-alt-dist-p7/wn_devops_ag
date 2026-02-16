import { useEffect, useMemo } from "react";
import {Controller, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { createArticle, updateArticle } from "../services/article";
import SelectCategory from "./SelectCategory.tsx";

export type ArticleFormData = {
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  category: {id: number};
};

type Props = {
  defaultValues?: ArticleFormData;
  articleId?: number;
  deletedAt?: string | null;
  onClose?: () => void;
};

const EMPTY_VALUES: ArticleFormData = {
  title: "",
  subtitle: "",
  summary: "",
  content: "",
  category: {id: 0},
};

export default function ArticleForm({
                                      defaultValues,
                                      articleId,
                                      deletedAt,
                                      onClose,
                                    }: Props) {
  const isEditMode = useMemo(
      () => Number.isInteger(articleId) && (articleId as number) > 0,
      [articleId]
  );

  const isDeleted = isEditMode && !!deletedAt;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArticleFormData>({
    defaultValues: defaultValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    reset(defaultValues ?? EMPTY_VALUES);
  }, [defaultValues, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    try {
      if (isEditMode) {
        await updateArticle(articleId as number, data);
        toast.success("Article modifié avec succès");
      } else {
        await createArticle(data);
        toast.success("Article créé avec succès");
      }
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-secondary px-4 py-10 font-serif text-primary">
        <div className="w-full max-w-2xl bg-white/90 border border-black/10 rounded-2xl p-8 shadow-sm">
          {isDeleted && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <span className="text-sm font-semibold">
              Cet article a été supprimé.
            </span>
              </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold text-tertiary">
              {isEditMode ? "Modifier l’article" : "Nouvel article"}
            </h2>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer"
                    title="Fermer"
                    className="rounded-full p-1 text-primary hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                >
                  <IoClose size={25} />
                </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Title */}
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 text-sm font-semibold">
                Titre
              </label>
              <input
                  {...register("title", {
                    required: "Le titre est requis",
                    maxLength: { value: 300, message: "Max 300 caractères" },
                  })}
                  id="title"
                  type="text"
                  className="rounded-lg border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                  placeholder="Titre de l’article"
              />
              {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Subtitle */}
            <div className="flex flex-col">
              <label htmlFor="subtitle" className="mb-1 text-sm font-semibold">
                Sous-titre
              </label>
              <input
                  {...register("subtitle", {
                    required: "Le sous-titre est requis",
                    maxLength: { value: 300, message: "Max 300 caractères" },
                  })}
                  id="subtitle"
                  type="text"
                  className="rounded-lg border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                  placeholder="Sous-titre"
              />
              {errors.subtitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
              )}
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <label htmlFor="summary" className="mb-1 text-sm font-semibold">
                Chapeau
              </label>
              <input
                  {...register("summary", {
                    required: "Le chapeau est requis",
                    maxLength: { value: 1000, message: "Max 1000 caractères" },
                  })}
                  id="summary"
                  type="text"
                  className="rounded-lg border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                  placeholder="Phrase d’introduction"
              />
              {errors.summary && (
                  <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
              )}
            </div>

            {/* Category */}
            <Controller
                name="category.id"
                control={control}
                rules={{ required: "La catégorie est obligatoire" }}
                render={({ field }) => (
                    <SelectCategory
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.category?.id?.message}
                    />
                )}
            />

            {/* Content */}
            <div className="flex flex-col">
              <label htmlFor="content" className="mb-1 text-sm font-semibold">
                Contenu
              </label>
              <textarea
                  {...register("content", {
                    required: "Le contenu est requis",
                    maxLength: { value: 10000, message: "Max 10000 caractères" },
                  })}
                  id="content"
                  rows={8}
                  className="rounded-lg border border-black/20 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-tertiary/30"
                  placeholder="Contenu de l’article..."
              />
              {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 pt-4">
              {onClose && (
                  <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg border border-black/20 px-6 py-2 text-sm font-semibold hover:bg-black/5"
                  >
                    Annuler
                  </button>
              )}

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-secondary hover:opacity-95 disabled:opacity-60"
              >
                {isSubmitting
                    ? "Enregistrement…"
                    : isEditMode
                        ? "Mettre à jour"
                        : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
