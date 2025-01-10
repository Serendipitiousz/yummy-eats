import Image from "next/image";
import SearchForm from "../components/SearchForm";
import RecipeCard from "@/components/RecipeCard";

import "antd/dist/reset.css";
import { supabase } from "../utils/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching data</p>;
  } else {
    console.log("Data fetched successfully:", data);
  }

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
          {query ? `Search results for "${query}"` : "All Recipe"}
        </p>
        <ul className="mt-7 card_grid">
          {data?.length > 0 ? (
            data.map((item) => <RecipeCard key={item.id} item={item} />)
          ) : (
            <p className="no-results"> No recipes found</p>
          )}
        </ul>
      </section>
    </>
  );
}
