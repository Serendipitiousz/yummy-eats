"use client";

import { useEffect, useState } from "react";
import { Card, Row, Spin } from "antd"; // Added Spin for loading spinner
import { supabase } from "../../../../utils/supabaseClient";
import RecipeCard from "@/components/RecipeCard";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const pathname = usePathname(); // Extract the current pathname to get the userId
  const userId = pathname.split("/").pop(); // Assuming the userId is the last part of the path

  interface UserInfo {
    username: string;
    profile_pic: string | null;
  }
  interface BlogPost {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    post_image: string;
    profile_pic: string;
    username: string;
  }
  const [info, setInfo] = useState<UserInfo[]>([]);
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Wait until pathname is available and userId is extracted for fetching data
  useEffect(() => {
    if (!userId) return; // Ensure userId is available

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          setError("Error fetching data");
        } else {
          setData(data);
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("username, profile_pic")
          .eq("user_id", userId)
          .limit(1);

        if (error) {
          setError("Error fetching recipe data");
          console.error(error);
        } else {
          setInfo(data);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();

    fetchData();
  }, [userId]); // Run when userId changes

  // Loading state while waiting for the userId
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" /> {/* Ant Design Spinner */}
        <p>Loading...</p>
      </div>
    );
  }

  // Error state if fetching data fails
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Card>
      <Row justify="center" style={{ gap: "50px" }}>
        {info.length > 0 ? (
          <>
            <Image
              width={200}
              height={200}
              src={info[0].profile_pic || "/default-profile.jpg"} // Provide a default image URL
              alt="User Profile"
              style={{
                borderRadius: "50%",
                width: "200px",
                height: "200px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(0, 0, 0, 0.08)",
              }}
            />
            <p
              style={{
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {info[0].username || "Anonymous User"}
            </p>
          </>
        ) : (
          <p>No user information available</p>
        )}
      </Row>
      <Row>
        <section className="section_container">
          <ul className="mt-7 card_grid">
            {data.length > 0 ? (
              data.map((item) => <RecipeCard key={item.id} item={item} />)
            ) : (
              <p className="no-results">No recipes found</p>
            )}
          </ul>
        </section>
      </Row>
    </Card>
  );
};

export default Page;
