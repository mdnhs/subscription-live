import { ToolsResponse } from "@/_types/product";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getExpireDays,
  getFormattedExpireDate,
} from "@/function/dateFormatter";
import OrderAccessButton from "./OrderAccessButton";

const OrderCard: React.FC<ToolsResponse> = ({
  category,
  createdAt,
  month,
  toolData,
  targetUrl,
}) => {
  return (
    <Card className="overflow-hidden py-0 h-fit">
      <CardContent className="p-0 dark:bg-teal-700">
        <div className="items-start">
          <div className="p-4 flex-1">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {category}
                  </Badge>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                Expire Date: <br />
                {getFormattedExpireDate(createdAt, month)} (
                {getExpireDays(month)})
              </Badge>
              <OrderAccessButton
                category={category}
                targetUrl={targetUrl}
                toolData={toolData}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
