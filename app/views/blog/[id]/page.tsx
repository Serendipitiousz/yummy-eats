"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import Link from "next/link";
export default function RecipeDetail({ params }: { params: { id: string } }) {
  const { id } = params; // Extract the id from params

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setError("Error fetching recipe data");
          console.error(error);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div ref={contentRef}>
      <div className="w-full md:w-4/6 lg:w-3/5 mx-auto p-6 sm:p-8 md:p-12 bg-[rgb(250,249,246)] print:bg-white">
        <div className="flex">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8 print:text-black print:text-2xl">
            {recipe.title}
          </h1>
        </div>

        <div className="flex justify-between items-center mb-6 print:hidden">
          {/* Profile Section */}
          <Link href={`/views/user/${[id]}`}>
            <div className="flex items-center gap-3">
              <img
                src={recipe.profile_pic}
                alt="Profile"
                className="rounded-full w-10 h-10 object-cover"
              />
              <p className="text-sm text-gray-700 font-medium">
                {recipe.username}
              </p>
            </div>
          </Link>

          {/* <p className="text-sm text-gray-500">
            {new Date(recipe.created_at).toLocaleDateString()}
          </p> */}

          {/* Print Button */}
          <button
            onClick={() => reactToPrintFn()}
            className="hidden sm:block print:block "
          >
            <Printer />
          </button>
        </div>

        {/* Title */}

        {/* Image Container */}
        <div className="relative pb-[75%] mb-6 sm:mb-8 overflow-hidden rounded-3xl print:pb-0 print:h-[200px] print:w-auto print:mx-auto">
          <img
            src={recipe.post_image}
            alt={recipe.title}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl print:relative print:w-auto print:h-[200px] print:object-contain print:rounded-md"
          />
        </div>

        {/* Ingredients */}
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-4 sm:mb-6 print:text-black print:text-lg">
          Ingredients
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 print:text-black print:text-sm">
          {recipe.ingredients}
        </p>

        {/* Instructions */}
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-4 sm:mb-6 print:text-black print:text-lg">
          Instructions
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 print:text-black print:text-sm">
          {recipe.instructions}
        </p>
      </div>
    </div>
  );
}
