"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CirclePlus, House, ScrollText } from "lucide-react";
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
    <header className="  bg-white shadow-sm py-4 px-5 font-work-sans">
      <Row justify="space-between" align="middle">
        <Col>
          <Link href="/">
            <Image
              src="/logo.png"
              priority
              alt="logo"
              width={120}
              height={24}
            />
          </Link>
        </Col>

        {/* Navigation Links Section (for larger screens) */}
        <Col className="hidden sm:block">
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

      {/* Footer Navigation Links Section (for mobile screens) */}
      <footer className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-sm py-4 px-5 z-10 rounded-t-xl">
        <Row justify="space-around" align="middle">
          <Link href={"/"}>
            <House style={{ color: "#A9A9A9" }} />
          </Link>
          {/* Mobile Footer - Create Button */}
          {pathname !== "/views/create" && (
            <Link href="/views/create">
              <CirclePlus style={{ color: "#A9A9A9" }} />
            </Link>
          )}

          {/* Signed Out Section */}
          <SignedOut>
            <SignInButton />
          </SignedOut>

          {/* Signed In Section */}
          <SignedIn>
            <UserButton showName={false}>
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
        </Row>
      </footer>
    </header>
  );
};

export default Navbar;
