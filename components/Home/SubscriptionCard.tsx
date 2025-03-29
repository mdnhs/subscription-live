import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { BadgeDollarSign, Lock, Unlock } from "lucide-react";
import Link from "next/link";

interface CookieItem {
  _id: string;
  title: string;
  targetUrl: string;
  json: { name: string; value: string }[] | string;
}

interface Props {
  item: {
    _id: string;
    title: string;
    targetUrl: string;
  };
  isLoading: boolean;
  isAuthenticated: boolean;
  isProduction: boolean;
  handleEncryptAndCopy: (item: CookieItem) => Promise<void>;
  handleDecryptAndCopy: (item: CookieItem) => Promise<void>;
  cookies?: string;
}

const SubscriptionCard = ({
  item,
  isLoading,
  isAuthenticated,
  isProduction,
  cookies,
  handleEncryptAndCopy,
  handleDecryptAndCopy,
}: Props) => {
  return (
    <Card
      key={item._id}
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{item.title}</span>
        </CardTitle>
        <CardDescription>
          Get access for {item.title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <Button
              onClick={() => handleEncryptAndCopy(item)}
              disabled={isLoading}
              className="w-full"
            >
              <Unlock className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Unlock Premium"}
            </Button>
          ) : (
            <Link href="/login">
              <Button disabled={isLoading} className="w-full">
                <BadgeDollarSign className="mr-2 h-4 w-4" />
                Buy Premium
              </Button>
            </Link>
          )}
          {!isProduction && (
            <Button
              onClick={() => handleDecryptAndCopy(item)}
              variant="outline"
              disabled={isLoading || !cookies}
              className="w-full"
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Decrypt & Copy"}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Website URL: {item.targetUrl.split("//")[1]}</p>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
