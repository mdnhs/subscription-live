"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Cookie {
  domain: string;
  expirationDate?: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite?: string | null;
  secure: boolean;
  session: boolean;
  storeId: string | null;
  value: string;
}

interface Subscription {
  _id: string;
  title: string;
  targetUrl: string;
  json: Cookie[];
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    targetUrl: "",
    json: "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [pagination.page]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/subscriptions?page=${pagination.page}&limit=${pagination.limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch subscriptions");

      const data = await res.json();
      setSubscriptions(data.data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubscription = async () => {
    try {
      let parsedJson: Cookie[];
      try {
        parsedJson = JSON.parse(formData.json);
        if (!Array.isArray(parsedJson)) {
          throw new Error("JSON must be an array of cookie objects");
        }
      } catch {
        throw new Error("Invalid JSON format in cookies field");
      }

      const newSubscription = {
        title: formData.title,
        targetUrl: formData.targetUrl,
        json: parsedJson,
      };

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscription),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add subscription");
      }

      toast.success("Subscription Added", {
        description: `${formData.title} has been successfully added`,
      });
      setFormData({ id: "", title: "", targetUrl: "", json: "" });
      setIsAddDialogOpen(false);
      fetchSubscriptions();
    } catch (err) {
      toast.error("Failed to Add Subscription", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  const handleEditSubscription = async () => {
    try {
      let parsedJson: Cookie[];
      try {
        parsedJson = JSON.parse(formData.json);
        if (!Array.isArray(parsedJson)) {
          throw new Error("JSON must be an array of cookie objects");
        }
      } catch {
        throw new Error("Invalid JSON format in cookies field");
      }

      const updatedSubscription = {
        title: formData.title,
        targetUrl: formData.targetUrl,
        json: parsedJson,
      };

      const res = await fetch(`/api/subscriptions?id=${formData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubscription),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update subscription");
      }

      toast.success("Subscription Updated", {
        description: `${formData.title} has been successfully updated`,
      });
      setFormData({ id: "", title: "", targetUrl: "", json: "" });
      setIsEditDialogOpen(false);
      fetchSubscriptions();
    } catch (err) {
      toast.error("Failed to Update Subscription", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  const handleDeleteSubscription = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/subscriptions?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete subscription");
      }

      toast.success("Subscription Deleted", {
        description: `${title} has been successfully deleted`,
      });
      fetchSubscriptions();
    } catch (err) {
      toast.error("Failed to Delete Subscription", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };

  const openEditDialog = (subscription: Subscription) => {
    setFormData({
      id: subscription._id,
      title: subscription.title,
      targetUrl: subscription.targetUrl,
      json: JSON.stringify(subscription.json, null, 2),
    });
    setIsEditDialogOpen(true);
  };

  const copyToClipboard = (cookies: Cookie[]) => {
    navigator.clipboard.writeText(JSON.stringify(cookies, null, 2));
    toast.success("Copied to clipboard", {
      description: "Cookie data has been copied to clipboard",
    });
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Manager</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Subscription</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Enter subscription details and cookie JSON data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chat GPT 4o"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input
                  id="targetUrl"
                  name="targetUrl"
                  value={formData.targetUrl}
                  onChange={handleInputChange}
                  placeholder="e.g., https://chatgpt.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="json">Cookies (JSON)</Label>
                <Textarea
                  id="json"
                  name="json"
                  value={formData.json}
                  onChange={handleInputChange}
                  placeholder='Paste JSON array here, e.g., [{"name": "cookie", "value": "xyz", ...}]'
                  rows={6}
                  required
                  className="h-40 overflow-y-scroll"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddSubscription}>
                Add Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Subscriptions Found</CardTitle>
            <CardDescription>
              Add subscription data to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{subscription.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <a
                        href={subscription.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:underline"
                      >
                        {subscription.targetUrl}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(subscription.json)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(subscription)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDeleteSubscription(subscription._id, subscription.title)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cookie Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Attributes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscription.json.slice(0, 3).map((cookie, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {cookie.name}
                          </TableCell>
                          <TableCell>{cookie.domain}</TableCell>
                          <TableCell>
                            {cookie.session ? (
                              <Badge variant="outline">Session</Badge>
                            ) : (
                              formatDate(cookie.expirationDate)
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {cookie.httpOnly && (
                                <Badge variant="secondary">HttpOnly</Badge>
                              )}
                              {cookie.secure && (
                                <Badge variant="secondary">Secure</Badge>
                              )}
                              {cookie.sameSite && (
                                <Badge variant="secondary">
                                  SameSite: {cookie.sameSite}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {subscription.json.length > 3 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {subscription.json.length - 3} more cookies not shown
                  </p>
                )}
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total Cookies: {subscription.json.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated:{" "}
                  {new Date(subscription.updatedAt || "").toLocaleString()}
                </div>
              </CardFooter>
            </Card>
          ))}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Subscription</DialogTitle>
                <DialogDescription>
                  Modify the subscription details and cookie JSON data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Chat GPT 4o"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-targetUrl">Target URL</Label>
                  <Input
                    id="edit-targetUrl"
                    name="targetUrl"
                    value={formData.targetUrl}
                    onChange={handleInputChange}
                    placeholder="e.g., https://chatgpt.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-json">Cookies (JSON)</Label>
                  <Textarea
                    id="edit-json"
                    name="json"
                    value={formData.json}
                    onChange={handleInputChange}
                    placeholder='Paste JSON array here, e.g., [{"name": "cookie", "value": "xyz", ...}]'
                    rows={6}
                    required
                    className="h-40 overflow-y-scroll"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleEditSubscription}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {pagination.pages > 1 && (
            <div className="col-span-2 flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <div className="flex items-center px-2">
                Page {pagination.page} of {pagination.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}