"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollText } from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Row, Space, Col } from "antd";
import { Button } from "antd";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const userId = user?.id;
  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <Row justify="space-between" align="middle">
        <Col>
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
          </Link>
        </Col>

        {/* Navigation Links Section */}
        <Col>
          <Space size="large">
            {pathname !== "/views/create" && (
              <Link href="/views/create">
                <Button color="default" size="large" variant="solid">
                  Create
                </Button>
              </Link>
            )}

            {/* Signed Out Section */}
            <SignedOut>
              <SignInButton />
            </SignedOut>

            {/* Signed In Section */}
            <SignedIn>
              <UserButton showName>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Posts"
                    labelIcon={<ScrollText size={16} />}
                    href={`/views/user/${userId}`}
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </Space>
        </Col>
      </Row>
    </header>
  );
};

export default Navbar;
