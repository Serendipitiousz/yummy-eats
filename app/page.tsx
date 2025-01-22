import SearchForm from "../components/SearchForm";
import RecipeCard from "@/components/RecipeCard";
import { supabase } from "../utils/supabaseClient";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function Home({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const query = params?.query || "";
  /* eslint-enable @typescript-eslint/no-explicit-any */
  // Fetch all recipes from Supabase
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("isdeleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching data</p>;
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
