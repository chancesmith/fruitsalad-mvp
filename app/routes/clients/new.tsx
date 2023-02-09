import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createClient } from "~/models/client.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");

  const errors = { firstName: null, lastName: null, email: null };

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { ...errors, firstName: "First name is required" } },
      { status: 400 }
    );
  }

  if (typeof lastName !== "string" || lastName.length === 0) {
    return json(
      { errors: { ...errors, lastName: "Last name is required" } },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || email.length === 0) {
    return json(
      { errors: { ...errors, email: "Email is required" } },
      { status: 400 }
    );
  }

  const client = await createClient({ firstName, lastName, email, userId });

  return redirect(`/clients/${client.id}`);
}

export default function NewClientPage() {
  const actionData = useActionData<typeof action>();
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      lastNameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>First Name: </span>
          <input
            ref={firstNameRef}
            name="firstName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.firstName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.firstName ? "firstName-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.firstName && (
          <div className="pt-1 text-red-700" id="firstName-error">
            {actionData.errors.firstName}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Last Name: </span>
          <input
            ref={lastNameRef}
            name="lastName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.lastName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.lastName ? "lastName-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.lastName && (
          <div className="pt-1 text-red-700" id="lastName-error">
            {actionData.errors.lastName}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Email: </span>
          <input
            ref={emailRef}
            name="email"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-errormessage={
              actionData?.errors?.email ? "email-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.email && (
          <div className="pt-1 text-red-700" id="email-error">
            {actionData.errors.email}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
