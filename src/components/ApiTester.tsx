"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Play, Copy, Check, AlertCircle, Info } from "lucide-react";

type ParamValue = string | number | boolean | string[] | undefined;

interface QueryParam {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "email";
  required?: boolean;
  default?: ParamValue;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
}

interface BodyField {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "array" | "email";
  required?: boolean;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
}

interface PathParam {
  name: string;
  type: "string" | "number";
  required?: boolean;
  description?: string;
  default?: ParamValue;
}

interface ApiKey {
  key: string;
  role: string;
  description: string;
}

interface ApiTesterProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  title: string;
  description: string;
  defaultParams?: Record<string, ParamValue>;
  defaultBody?: Record<string, ParamValue>;
  queryParams?: QueryParam[];
  bodySchema?: BodyField[];
  pathParams?: PathParam[];
  showAuthSection?: boolean;
  defaultApiKey?: string;
  availableApiKeys?: ApiKey[];
}

interface TestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  time: number;
  error?: string;
}

export function ApiTester({
  endpoint,
  method,
  title,
  description,
  defaultParams = {},
  defaultBody = {},
  queryParams = [],
  bodySchema = [],
  pathParams = [],
  showAuthSection = false,
  defaultApiKey = "demo-api-key-123",
  availableApiKeys = [
    {
      key: "demo-api-key-123",
      role: "user",
      description: "User role - read access only",
    },
    {
      key: "test-api-key-456",
      role: "moderator",
      description: "Moderator role - can create/update characters",
    },
    {
      key: "admin-api-key-789",
      role: "admin",
      description: "Admin role - full access",
    },
    {
      key: "invalid_key",
      role: "invalid",
      description: "Invalid key - will return 401",
    },
  ],
}: ApiTesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TestResponse | null>(null);
  const [params, setParams] =
    useState<Record<string, ParamValue>>(defaultParams);
  const [body, setBody] = useState<Record<string, ParamValue>>(defaultBody);
  const [pathValues, setPathValues] = useState<Record<string, ParamValue>>({});
  const [selectedApiKey, setSelectedApiKey] = useState(defaultApiKey);
  const [copied, setCopied] = useState(false);

  // Create stable initial path values using useMemo
  const initialPathValues = useMemo(() => {
    const values: Record<string, ParamValue> = {};
    pathParams.forEach((param) => {
      if (param.default !== undefined) {
        values[param.name] = param.default;
      }
    });
    return values;
  }, [pathParams]);

  // Initialize path values only once
  useEffect(() => {
    if (Object.keys(initialPathValues).length > 0) {
      setPathValues(initialPathValues);
    }
  }, [initialPathValues]);

  const buildUrl = () => {
    let url = endpoint;

    // Make sure the URL is relative to the current domain
    if (!url.startsWith("http")) {
      url = url.startsWith("/") ? url : `/${url}`;
    }

    // Replace path parameters
    pathParams.forEach((param) => {
      const value = pathValues[param.name] || param.default || "";
      url = url.replace(`{${param.name}}`, String(value));
    });

    // Add query parameters
    const queryParamsList = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);

    if (queryParamsList.length > 0) {
      url += `?${queryParamsList.join("&")}`;
    }

    return url;
  };

  const sendRequest = async () => {
    setIsLoading(true);
    setResponse(null);

    try {
      const url = buildUrl();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (showAuthSection) {
        headers["x-api-key"] = selectedApiKey;
      }

      const requestOptions: RequestInit = {
        method,
        headers,
      };

      if (method !== "GET" && Object.keys(body).length > 0) {
        requestOptions.body = JSON.stringify(body);
      }

      const startTime = Date.now();
      const response = await fetch(url, requestOptions);
      const endTime = Date.now();

      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "Network Error",
        headers: {},
        body: null,
        time: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
    if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800";
    if (status >= 500) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const renderParamInput = (
    param: QueryParam | BodyField | PathParam,
    value: ParamValue,
    onChange: (value: ParamValue) => void
  ) => {
    switch (param.type) {
      case "select":
        return (
          <Select
            value={String(value || (param as QueryParam).default || "")}
            onValueChange={onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={param.description} />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <Select
            value={String(value || false)}
            onValueChange={(val) => onChange(val === "true")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.description}
            min={(param as QueryParam | BodyField).min}
            max={(param as QueryParam | BodyField).max}
          />
        );
      case "array":
        return (
          <Textarea
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(e) =>
              onChange(e.target.value.split(", ").filter(Boolean))
            }
            placeholder={param.description}
            rows={3}
          />
        );
      default:
        return (
          <Input
            type={param.type === "email" ? "email" : "text"}
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={param.description}
            maxLength={(param as QueryParam | BodyField).maxLength}
          />
        );
    }
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge
            variant={
              method === "GET"
                ? "default"
                : method === "POST"
                ? "secondary"
                : "destructive"
            }
          >
            {method}
          </Badge>
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="space-y-4">
            {/* Path Parameters */}
            {pathParams.length > 0 && (
              <div className="space-y-2">
                <Label>Path Parameters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pathParams.map((param) => (
                    <div key={param.name} className="space-y-1">
                      <Label className="text-xs">
                        {param.name}{" "}
                        {param.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {renderParamInput(
                        param,
                        pathValues[param.name],
                        (value) =>
                          setPathValues((prev) => ({
                            ...prev,
                            [param.name]: value,
                          }))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Query Parameters */}
            {queryParams.length > 0 && (
              <div className="space-y-2">
                <Label>Query Parameters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {queryParams.map((param) => (
                    <div key={param.name} className="space-y-1">
                      <Label className="text-xs">
                        {param.name}{" "}
                        {param.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {renderParamInput(param, params[param.name], (value) =>
                        setParams((prev) => ({ ...prev, [param.name]: value }))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {bodySchema.length > 0 && method !== "GET" && (
              <div className="space-y-2">
                <Label>Request Body</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bodySchema.map((field) => (
                    <div key={field.name} className="space-y-1">
                      <Label className="text-xs">
                        {field.name}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {renderParamInput(field, body[field.name], (value) =>
                        setBody((prev) => ({ ...prev, [field.name]: value }))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={sendRequest}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="response" className="space-y-4">
            {response ? (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(response.status)}>
                    {response.status} {response.statusText}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ({response.time}ms)
                  </span>
                </div>

                {/* Error */}
                {response.error && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{response.error}</AlertDescription>
                  </Alert>
                )}

                {/* Headers */}
                <div className="space-y-2">
                  <Label>Response Headers</Label>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-blue-600">{key}:</span>
                        <span className="dark:text-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Response Body</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(response.body, null, 2))
                      }
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:text-black p-4 rounded text-xs font-mono max-h-96 overflow-y-auto">
                    <pre>{JSON.stringify(response.body, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Info className="h-8 w-8 mx-auto mb-2" />
                <p>Send a request to see the response here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="curl" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>cURL Command</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(buildCurlCommand())}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-gray-50 dark:text-black p-4 rounded text-xs font-mono overflow-x-auto">
                <pre>{buildCurlCommand()}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  function buildCurlCommand(): string {
    const url = buildUrl();
    let curl = `curl -X ${method} "${url}"`;

    // Add headers
    if (showAuthSection) {
      curl += ` \\\n  -H "x-api-key: ${selectedApiKey}"`;
    }

    if (method !== "GET" && Object.keys(body).length > 0) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${JSON.stringify(body)}'`;
    }

    return curl;
  }
}
