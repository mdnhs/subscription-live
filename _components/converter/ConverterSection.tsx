"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, Unlock, Copy, ArrowRight } from "lucide-react";
import { decrypt, encrypt } from "@/function/cryptoDecrypt";

const ConverterSection = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isEncryptMode, setIsEncryptMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const encryptionKey = process.env.DECRYPT_PASS || "";
  

  const handleConvert = () => {
    setError("");
    setResult("");
    setCopied(false);

    if (!inputText.trim()) {
      setError("Please provide text to process");
      return;
    }

    if (!encryptionKey) {
      setError("Encryption key not configured");
      return;
    }

    try {
      if (isEncryptMode) {
        const encrypted = encrypt(inputText, encryptionKey);
        setResult(encrypted);
      } else {
        const decrypted = decrypt(inputText, encryptionKey);
        setResult(decrypted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const toggleMode = () => {
    setIsEncryptMode(!isEncryptMode);
    setInputText("");
    setResult("");
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearFields = () => {
    setInputText("");
    setResult("");
    setError("");
    setCopied(false);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-md">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {isEncryptMode ? "Encrypt Text" : "Decrypt Text"}
            </CardTitle>
            <CardDescription className="mt-1">
              {isEncryptMode
                ? "Convert your text to encrypted format using AES-128"
                : "Convert encrypted text back to plain text"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={toggleMode}
            className="bg-white dark:bg-slate-700"
          >
            Switch to {isEncryptMode ? "Decrypt" : "Encrypt"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Mobile layout (stacked) */}
        <div className="md:hidden space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-text-mobile" className="text-sm font-medium">
              {isEncryptMode ? "Text to Encrypt" : "Encrypted Text"}
            </Label>
            <Textarea
              id="input-text-mobile"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isEncryptMode ? "Enter text to encrypt" : "Enter encrypted text"
              }
              rows={5}
              className="min-h-20 w-full break-words max-h-20 overflow-y-scroll"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={handleConvert} size="sm" className="rounded-full">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result-mobile" className="text-sm font-medium">
              Result
            </Label>
            <Textarea
              id="result-mobile"
              value={result}
              readOnly
              rows={5}
              className="min-h-20 max-h-20 break-words overflow-y-auto w-full bg-slate-50 dark:bg-slate-800"
              placeholder="Result will appear here"
            />
            {result && (
              <Button
                variant={copied ? "secondary" : "outline"}
                size="sm"
                onClick={handleCopy}
                className="w-full mt-2"
              >
                <Copy className="mr-2 h-4 w-4" />{" "}
                {copied ? "Copied" : "Copy Result"}
              </Button>
            )}
          </div>
        </div>

        {/* Desktop layout (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" col-span-1 space-y-2">
            <Label htmlFor="input-text" className="text-sm font-medium">
              {isEncryptMode ? "Text to Encrypt" : "Encrypted Text"}
            </Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isEncryptMode ? "Enter text to encrypt" : "Enter encrypted text"
              }
              rows={8}
              className="min-h-96 w-full max-h-96"
            />
          </div>

          <div className="space-y-2  col-span-1">
            <Label htmlFor="result" className="text-sm font-medium">
              Result
            </Label>
            <Textarea
              id="result"
              value={result}
              readOnly
              rows={8}
              className="min-h-96 w-full bg-slate-50 dark:bg-slate-800 max-h-96"
              placeholder="Result will appear here"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={handleConvert} className="flex-1">
            {isEncryptMode ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Encrypt
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" /> Decrypt
              </>
            )}
          </Button>

          {result && (
            <Button
              onClick={handleCopy}
              variant={copied ? "secondary" : "outline"}
              className="flex-1 hidden md:flex"
            >
              <Copy className="mr-2 h-4 w-4" />{" "}
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={clearFields}
            className="flex-1"
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConverterSection;
