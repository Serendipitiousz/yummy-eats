"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Card } from "antd";

const RecipeCard = ({ item }: any) => {
  return (
    <Card
      key={item.id}
      style={{
        borderRadius: "24px",

        border: "none",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      cover={
        <Image
          width={500}
          height={500}
          priority
          alt="example"
          src={item.post_image}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "24px",
            height: "300px",
            objectFit: "cover",
          }}
        />
      }
    >
      <div className="flex-1">
        <Link href={`/views/blog/${item.id}`}>
          <h2 className="text-26-semibold line-clamp-1">{item.title}</h2>
        </Link>
      </div>

      <div className="flex">
        <div className="flex gap-1">
          <Link href={`/views/user/${item.user_id}`}>
            <Image
              src={item.profile_pic}
              alt="placeholder"
              width={50} // Set width to 50px
              height={50} // Set height to 50px (same value as width)
              style={{
                width: "20px", // Set width to 50px
                height: "20px", // Set height to 50px (same value as width)
                borderRadius: "50%", // Make the image circular
                objectFit: "cover", // Ensure the image fits the circle properly
              }}
            />
          </Link>
          <div>
            <h3>{item.username}</h3>
          </div>
        </div>

        <div className="ml-auto">
          <p className="startup_card_date">
            {new Date(item.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
