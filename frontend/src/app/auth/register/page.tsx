import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/user-auth-form';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Create an account',
  description: 'Start to discover the greatness of Embodied AI.',
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/auth/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6">
            <Icons.logo className="mx-auto h-24 w-24" />
            <div>
              <h1 className="text-4xl font-bold">AgentOk</h1>
              <p className="text-lg mt-2">AG2 Visualized</p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm isSignUp />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
