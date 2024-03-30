import { SubmitButton } from "../login/submit-button";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SetPassword({
  searchParams,
}: {
  searchParams: { message: string }
}) {

  const supabase = createClient()

  const { data: { user }, } = await supabase.auth.getUser()

  const setPassword = async (formData: FormData) => {
    'use server'

    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return redirect('/set-password?message=Could not update user password')
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          >
          <h1 className="mb-10 text-bold text-2xl lg:text-3xl">Set  Password</h1>
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6 cursor-not-allowed"
            name="email"
            value={user?.email}
            disabled
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
          formAction={setPassword}
          className="bg-green-700 rounded-md px-4 py-2 text-white mb-2"
          pendingText="Setting Password..."
        >
          Set Password
        </SubmitButton>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>


    </div>
  )
}