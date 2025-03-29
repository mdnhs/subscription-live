import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

interface SubscriptionSkeletonCardProps {
  isProduction: boolean;
}

const SubscriptionSkeletonCard = ({
  isProduction,
}: SubscriptionSkeletonCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          {!isProduction && <Skeleton className="h-10 w-full" />}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionSkeletonCard;
