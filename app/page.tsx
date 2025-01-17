import SearchForm from "../components/SearchForm";
import RecipeCard from "@/components/RecipeCard";

import "antd/dist/reset.css";
import { supabase } from "../utils/supabaseClient";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  // Fetch all recipes
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("isdeleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching data</p>;
  } else {
    console.log("Data fetched successfully:", data);
  }

  // Filter data if a query is provided
  const filteredData = query
    ? data?.filter(
        (item) => item.title.toLowerCase().includes(query.toLowerCase()) // Filter by title
      )
    : data;

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Share, Discover, and Inspire</h1>
        <p className="sub-heading !max-w-3xl">
          Publish your creations and inspire others with your culinary
          masterpieces.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Recipes"}
        </p>
        <ul className="mt-7 card_grid">
          {filteredData?.length > 0 ? (
            filteredData.map((item) => <RecipeCard key={item.id} item={item} />)
          ) : (
            <p className="no-results">No recipes found</p>
          )}
        </ul>
      </section>
    </>
  );
}
