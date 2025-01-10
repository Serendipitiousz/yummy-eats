"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Row, Space, Col } from "antd";
import { Button } from "antd";
import { usePathname } from "next/navigation";

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-user"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};
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
                    labelIcon={<UserIcon />}
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
