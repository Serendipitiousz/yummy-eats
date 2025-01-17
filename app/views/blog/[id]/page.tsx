"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";

export default function RecipeDetail() {
  interface Recipe {
    id: number;
    title: string;
    user_id: string;
    username: string;
    profile_pic: string;
    post_image: string;
    ingredients: string;
    instructions: string;
    isdeleted?: boolean;
    created_at?: string;
  }
  const { id } = useParams();
  const { user } = useUser();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
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
          console.log("Fetched recipe:", data); // Log fetched recipe
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

  const handleDelete = async () => {
    if (!recipe?.id || !user?.id || !recipe?.user_id) {
      console.error("Recipe or user ID is missing");
      return;
    }
    // Debugging logs
    console.log("Recipe ID:", typeof recipe.id);
    console.log("Logged-in user ID:", user?.id);
    console.log("Recipe user_id:", recipe?.user_id);
    console.log("param id", typeof id);
    console.log("Deleting recipe with ID:", id);

    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ isdeleted: true }) // Update the 'isdeleted' column to true
        .eq("id", id); // Match the post by its ID

      if (error) {
        console.error("Error marking the post as deleted:", error);
        return; // Exit if there's an error
      }

      console.log("Post marked as deleted successfully.");
    } catch (err) {
      // Catch any unexpected errors
      console.error("An unexpected error occurred:", err);
    } finally {
      // Optional: Add any cleanup actions or final messages
      console.log("Delete operation finished.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div ref={contentRef}>
      <div className="w-full md:w-4/6 lg:w-3/5 mx-auto p-6 sm:p-8 md:p-12 bg-[rgb(250,249,246)] print:bg-white">
        <div className="flex">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8 print:text-black print:text-2xl">
            {recipe?.title}
          </h1>
        </div>

        <div className="flex justify-between items-center mb-6 print:hidden">
          {/* Profile Section */}
          <Link href={`/views/user/${[recipe?.user_id]}`}>
            <div className="flex items-center gap-3">
              <Image
                width={40}
                height={40}
                src={recipe?.profile_pic || "/default-profile-pic.jpg"}
                alt="Profile"
                className="rounded-full w-10 h-10 object-cover"
              />
              <p className="text-sm text-gray-700 font-medium">
                {recipe?.username}
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
          {user?.id && recipe && user?.id === recipe.user_id && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>

        {/* Title */}

        {/* Image Container */}
        <div className="relative pb-[75%] mb-6 sm:mb-8 overflow-hidden rounded-3xl print:pb-0 print:h-[200px] print:w-auto print:mx-auto">
          <Image
            priority
            fill
            src={recipe?.post_image || "/default-image.jpg"}
            alt={recipe?.title || "Recipe image"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl print:relative print:w-auto print:h-[200px] print:object-contain print:rounded-md"
          />
        </div>

        {/* Ingredients */}
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-4 sm:mb-6 print:text-black print:text-lg">
          Ingredients
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 print:text-black print:text-sm">
          {recipe?.ingredients}
        </p>

        {/* Instructions */}
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mb-4 sm:mb-6 print:text-black print:text-lg">
          Instructions
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 print:text-black print:text-sm">
          {recipe?.instructions}
        </p>
      </div>
    </div>
  );
}
