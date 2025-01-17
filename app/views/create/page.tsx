"use client";
import React from "react";
import { Card, Form, Input, Button, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

interface FormValues {
  title: string;
  ingredients: string;
  instructions: string;
  food_type: string;
  post_image: any[]; // We can type it more specifically if necessary
}

const Page = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useUser(); // Get the current user from Clerk

  const userId = user?.id;
  const username = user?.username || user?.firstName;
  const success = () => {
    messageApi.open({
      duration: 3,
      type: "success",
      content: "Post Created",
      className: "custom-class",
      style: {
        padding: "20px",
        borderRadius: "10px",
      },
    });
  };

  const uploadImage = async (file: any) => {
    if (!file) return null;

    const uniqueFileName = `image_${Date.now()}_${file.name}`;

    try {
      const { error } = await supabase.storage
        .from("blog_images")
        .upload(`uploads/${uniqueFileName}`, file);

      if (error) {
        console.error("Image upload failed:", error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("blog_images")
        .getPublicUrl(`uploads/${uniqueFileName}`);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Unexpected error during image upload:", error);
      return null;
    }
  };

  const handleSubmit = async (values: any) => {
    console.log(userId);
    success();

    const { title, ingredients, instructions, food_type, post_image } = values;

    let imageUrl = null;
    if (post_image && post_image[0]?.originFileObj) {
      const file = post_image[0].originFileObj;
      imageUrl = await uploadImage(file);
    }

    if (!imageUrl) {
      console.error("Image upload failed, cannot submit post.");
      return;
    }

    if (!userId) {
      console.error("User is not logged in. Cannot submit post.");
      return;
    }

    try {
      const { data, error } = await supabase.from("blog_posts").insert([
        {
          title,
          ingredients,
          instructions,
          food_type,
          post_image: imageUrl,
          user_id: userId,
          username: username,
          profile_pic: user?.imageUrl,
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error.message);
      } else {
        console.log("Data inserted successfully: ", data);
      }
    } catch (err) {
      console.error("Unexpected error: ", err);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [form] = Form.useForm<FormValues>();
  return (
    <div className="flex justify-center p-4 sm:p-8 bg-[#FAF9F6] min-h-screen">
      <Card
        className="w-full max-w-full sm:max-w-2xl mx-auto rounded-xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-5"
        title={
          <div className="text-lg sm:text-2xl font-semibold text-center">
            Create a new post
          </div>
        }
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label={<div className="text-base sm:text-lg">Title</div>}
            name="title"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input
              className="py-2 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl w-full"
              placeholder="e.g., Gingery Cranberry Salsa"
            />
          </Form.Item>

          <Form.Item
            label={<div className="text-base sm:text-lg">Select Image</div>}
            labelCol={{ span: 24 }}
          >
            <Form.Item
              name="post_image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
              rules={[{ required: true, message: "Image is required" }]}
            >
              <Upload.Dragger
                name="post_image"
                listType="picture"
                accept=".jpg,.jpeg,.png"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label={<div className="text-base sm:text-lg">Ingredients</div>}
            name="ingredients"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Ingredients are required" }]}
          >
            <Input.TextArea
              showCount
              className="py-2 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl w-full"
              autoSize={{ minRows: 5 }}
              placeholder={`Ingredients:\n12–ounce bag of fresh cranberries\n1/3 cup sugar ...`}
            />
          </Form.Item>

          <Form.Item
            label={<div className="text-base sm:text-lg">Instructions</div>}
            name="instructions"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Instructions are required" }]}
          >
            <Input.TextArea
              showCount
              className="py-2 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl w-full"
              autoSize={{ minRows: 10 }}
              placeholder={`Instructions:\n1. Chop Cranberries...`}
            />
          </Form.Item>

          <Form.Item
            label={<div className="text-base sm:text-lg">Food Type</div>}
            name="food_type"
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: "Food type is required" }]}
          >
            <Input
              className="py-2 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl w-full"
              placeholder="e.g., Salsa"
            />
          </Form.Item>

          <Form.Item className="text-right">
            {contextHolder}
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="bg-[#000000] text-white px-6 py-3 rounded-lg"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
