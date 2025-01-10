'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const errorMessages: { [key: string]: string } = {
  default: 'An unexpected error occurred during authentication.',
  'session-missing': 'Your login session is missing or has expired.',
  'invalid-code': 'The authentication code is invalid or has expired.',
  'user-not-found': 'No user account was found with the provided credentials.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'default';

  const errorMessage = errorMessages[errorType] || errorMessages.default;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[640px]">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Icons.alert className="h-6 w-6 text-red-500" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>
            There was a problem with your authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant={'outline'}>
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
